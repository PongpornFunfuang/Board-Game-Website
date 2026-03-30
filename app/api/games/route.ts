/**
 * ไฟล์: Board-Game-Website/app/api/games/route.ts
 * หน้าที่: API Endpoint สำหรับจัดการข้อมูลบอร์ดเกม (CRUD)
 * เส้นทาง: /api/games
 */

import { createClient } from '@/lib/supabase/server' // นำเข้าฟังก์ชันเชื่อมต่อ Supabase ฝั่ง Server
import { NextRequest, NextResponse } from 'next/server' // เครื่องมือจัดการ Request และ Response ของ Next.js

/**
 * [METHOD: GET]
 * หน้าที่: ดึงรายการบอร์ดเกมทั้งหมด พร้อมรองรับการค้นหา (Search) และการกรองตามหมวดหมู่ (Category Filter)
 */
export async function GET(request: NextRequest) {
  // 1. เริ่มต้นการเชื่อมต่อฐานข้อมูล
  const supabase = await createClient()

  // 2. ดึงค่าจาก URL Parameters (เช่น ?search=...&category=...)
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')      // รับคำค้นหาชื่อเกม
  const categoryId = searchParams.get('category') // รับ ID หมวดหมู่

  // 3. สร้างคำสั่ง Query พื้นฐาน (ดึงเกมทั้งหมด พร้อม Join ข้อมูลหมวดหมู่ และเรียงตามวันที่สร้างล่าสุด)
  let query = supabase
    .from('board_games')
    .select('*, category:categories(*)') // ดึงทุกคอลัมน์จากเกม + ดึงข้อมูลหมวดหมู่ที่สัมพันธ์กันมาด้วย
    .order('created_at', { ascending: false }) // เรียงลำดับจากใหม่ไปเก่า

  // 4. เงื่อนไขเพิ่มเติม: ค้นหาด้วยชื่อ (ถ้ามีการส่งค่า search มา)
  if (search) {
    // ilike: ค้นหาข้อความแบบไม่สนใจตัวพิมพ์เล็ก-ใหญ่ (Case-insensitive)
    query = query.ilike('name', `%${search}%`)
  }

  // 5. เงื่อนไขเพิ่มเติม: กรองตามหมวดหมู่ (ถ้ามีการส่งค่า categoryId มา)
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  // 6. ประมวลผล Query และดึงข้อมูลจริงจาก Database
  const { data, error } = await query

  // 7. จัดการกรณีเกิด Error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 8. ส่งข้อมูลรายการเกมกลับไปเป็น JSON
  return NextResponse.json(data)
}

/**
 * [METHOD: POST]
 * หน้าที่: เพิ่มข้อมูลบอร์ดเกมใหม่ลงในฐานข้อมูล
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // 1. รับข้อมูล (Body) ที่ถูกส่งมาจากหน้าบ้าน (Frontend) ในรูปแบบ JSON
  const body = await request.json()

  // 2. บันทึกข้อมูลลงในตาราง 'board_games'
  const { data, error } = await supabase
    .from('board_games')
    .insert([body]) // ทำการ Insert ข้อมูล
    .select('*, category:categories(*)') // หลังจาก Insert ให้ดึงข้อมูลที่เพิ่งบันทึกกลับมาพร้อมชื่อหมวดหมู่ทันที
    .single() // มั่นใจว่าได้ข้อมูลกลับมาเป็น Object ชุดเดียว

  // 3. จัดการกรณีบันทึกไม่สำเร็จ (เช่น ข้อมูลไม่ครบตามเงื่อนไขตาราง)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. ส่งข้อมูลเกมที่เพิ่งสร้างสำเร็จกลับไปให้หน้าบ้าน (เพื่อใช้แสดงผลหรืออัปเดต UI)
  return NextResponse.json(data)
}