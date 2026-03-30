/**
 * ไฟล์: Board-Game-Website/lib/supabase/proxy.ts
 * หน้าที่: จัดการ Session ของผู้ใช้และควบคุมการเข้าถึงหน้าต่างๆ (Access Control)
 * การทำงาน: ทำงานในระดับ Middleware เพื่อดักจับ Request ก่อนจะไปถึงหน้า Page จริงๆ
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. สร้าง Response พื้นฐานขึ้นมาเพื่อเตรียมส่งต่อหรือแก้ไข Cookies
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. สร้าง Supabase Client พิเศษสำหรับจัดการ Cookies ใน Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // อ่าน Cookies จากตัว Request ที่ส่งมา
        getAll() {
          return request.cookies.getAll()
        },
        // เมื่อมีการอัปเดต Session (เช่น Refresh Token) ต้องเขียนค่าลงทั้งใน Request และ Response
        setAll(cookiesToSet) {
          // อัปเดตฝั่ง Request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          // สร้าง Response ใหม่พร้อม Cookies ที่อัปเดตแล้ว
          supabaseResponse = NextResponse.next({
            request,
          })
          // อัปเดตฝั่ง Response เพื่อส่งกลับไปหา Browser ของผู้ใช้
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // 3. ตรวจสอบว่ามีผู้ใช้อยู่ในระบบจริงหรือไม่ (Get Current User)
  // การใช้ getUser() มีความปลอดภัยสูงเพราะจะตรวจสอบกับ Server ของ Supabase โดยตรง
  const { data: { user } } = await supabase.auth.getUser()

  // --- [LOGIC: PROTECT ADMIN DASHBOARD] ---
  // ถ้าพยายามเข้าหน้า Dashboard ของ Admin (/admin/dashboard/...)
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // แต่ "ไม่มี User" (ไม่ได้ล็อกอิน) ให้ดีดกลับไปหน้า Login (/admin) ทันที
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  // --- [LOGIC: PREVENT RE-LOGIN] ---
  // ถ้า "ล็อกอินอยู่แล้ว" แต่อยากลองเข้าหน้า Login (/admin) อีกครั้ง
  if (request.nextUrl.pathname === '/admin' && user) {
    // ให้พาวาร์ปไปหน้า Dashboard เลย ไม่ต้องล็อกอินซ้ำ
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  // ส่งต่อ Response ที่จัดการ Cookies เรียบร้อยแล้วออกไป
  return supabaseResponse
}