/**
 * ไฟล์: Board-Game-Website/lib/supabase/server.ts
 * หน้าที่: สร้าง Supabase Client สำหรับใช้งานใน Server Components, Server Actions และ Route Handlers
 * การทำงาน: จัดการเรื่อง Authentication ผ่าน Cookies โดยทำงานบนฝั่ง Server ของ Next.js
 */

import { createServerClient } from '@supabase/ssr' // Library สำหรับจัดการ Supabase บน SSR
import { cookies } from 'next/headers' // ฟังก์ชันจัดการ Cookies ของ Next.js

/**
 * createClient: ฟังก์ชันสำหรับสร้างการเชื่อมต่อกับ Supabase จากฝั่ง Server
 */
export async function createClient() {
  // ดึง Cookie Store เพื่อใช้ตรวจสอบสถานะการ Login ของผู้ใช้งาน
  const cookieStore = await cookies()

  // สร้างและส่งค่า Server Client กลับออกไป
  return createServerClient(
    // ดึง URL และ Key ของ Supabase จากไฟล์ .env (เครื่องหมาย ! คือการยืนยันว่าค่านี้มีอยู่จริง)
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // getAll: ฟังก์ชันสำหรับอ่าน Cookies ทั้งหมด (ใช้ในการเช็ค Session)
        getAll() {
          return cookieStore.getAll()
        },
        // setAll: ฟังก์ชันสำหรับเขียนหรืออัปเดต Cookies (ใช้ในการ Login/Logout)
        setAll(cookiesToSet) {
          try {
            // วนลูปเพื่อตั้งค่า Cookies ตามที่ Supabase ร้องขอ
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // หากเรียกใช้ setAll จาก Server Component ปกติจะ Error (เพราะตั้งค่า Cookie ระหว่าง Render ไม่ได้)
            // จึงต้องครอบ catch ไว้เพื่อป้องกันแอปพัง ซึ่งเป็นพฤติกรรมปกติของ Next.js
          }
        },
      },
    },
  )
}