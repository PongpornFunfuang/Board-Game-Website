/**
 * ไฟล์: Board-Game-Website/app/api/games/[id]/route.ts
 * หน้าที่: API Endpoint สำหรับจัดการบอร์ดเกมรายตัว (ใช้ ID ในการระบุเป้าหมาย)
 * เส้นทาง: /api/games/[id]
 */

import { createClient } from '@/lib/supabase/server' // เชื่อมต่อ Supabase ฝั่ง Server
import { NextRequest, NextResponse } from 'next/server' // เครื่องมือจัดการ Request/Response

/**
 * [METHOD: GET]
 * หน้าที่: ดึงข้อมูลรายละเอียดของบอร์ดเกมเพียง 1 เกมตาม ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // รับ Parameter id จากชื่อโฟลเดอร์ [id]
) {
  // 1. รอรับค่า id จาก Dynamic Route
  const { id } = await params
  const supabase = await createClient()

  // 2. Query ข้อมูลเกมที่ ID ตรงกัน พร้อม Join ตารางหมวดหมู่
  const { data, error } = await supabase
    .from('board_games')
    .select('*, category:categories(*)') // ดึงข้อมูลทุกฟิลด์ + ข้อมูลหมวดหมู่
    .eq('id', id)  // เงื่อนไข: id ใน DB ต้องตรงกับ id ใน URL
    .single()      // มั่นใจว่าได้ข้อมูลเป็น Object ชิ้นเดียว

  // 3. จัดการ Error กรณีดึงข้อมูลไม่ได้
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. ส่งข้อมูลเกมกลับไปให้หน้าบ้าน
  return NextResponse.json(data)
}

/**
 * [METHOD: PUT]
 * หน้าที่: แก้ไข (Update) ข้อมูลบอร์ดเกมที่มีอยู่แล้ว
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  // 1. รับข้อมูลชุดใหม่ที่ส่งมาจาก Frontend ในรูปแบบ JSON
  const body = await request.json()

  // 2. สั่งอัปเดตข้อมูลในแถวที่ ID ตรงกัน
  const { data, error } = await supabase
    .from('board_games')
    .update(body)  // นำข้อมูลใน body ไปทับข้อมูลเดิม
    .eq('id', id)  // ระบุตัวที่จะอัปเดตด้วย ID
    .select('*, category:categories(*)') // เมื่ออัปเดตเสร็จ ให้ดึงข้อมูลที่อัปเดตแล้วกลับมาแสดงผลด้วย
    .single()

  // 3. จัดการ Error กรณีอัปเดตไม่สำเร็จ
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. ส่งข้อมูลที่อัปเดตเรียบร้อยแล้วกลับไป
  return NextResponse.json(data)
}

/**
 * [METHOD: DELETE]
 * หน้าที่: ลบบอร์ดเกมออกจากฐานข้อมูล
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // 1. สั่งลบแถวข้อมูลในตาราง board_games ตาม ID ที่ระบุ
  const { error } = await supabase
    .from('board_games')
    .delete()
    .eq('id', id)

  // 2. จัดการ Error กรณีลบไม่ได้ (เช่น ID ไม่มีอยู่จริง หรือติดเงื่อนไขความสัมพันธ์ตาราง)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 3. ส่งสถานะความสำเร็จกลับไป (เนื่องจากลบแล้วข้อมูลหายไป จึงส่งแค่ success: true)
  return NextResponse.json({ success: true })
}