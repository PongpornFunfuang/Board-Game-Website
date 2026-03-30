/**
 * ไฟล์: Board-Game-Website/app/api/categories/[id]/route.ts
 * หน้าที่: API Endpoint สำหรับจัดการหมวดหมู่รายตัว (แก้ไข และ ลบ)
 * เส้นทาง: /api/categories/[id]
 */

import { createClient } from '@/lib/supabase/server' // นำเข้าฟังก์ชันเชื่อมต่อ Supabase ฝั่ง Server
import { NextRequest, NextResponse } from 'next/server' // เครื่องมือจัดการ HTTP Request และ Response

/**
 * [METHOD: PUT]
 * หน้าที่: แก้ไขข้อมูลหมวดหมู่ที่มีอยู่แล้วตาม ID ที่ระบุ
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // รับค่า id จาก URL (เช่น /api/categories/123-abc)
) {
  try {
    // 1. รอรับค่า id (Next.js 15 ต้องใช้ await กับ params)
    const { id } = await params 
    const supabase = await createClient() // เริ่มต้นเชื่อมต่อ Database
    
    // 2. รับข้อมูล JSON ใหม่ที่ส่งมาจากหน้าบ้าน (Body)
    const body = await request.json()

    // 3. สั่งอัปเดตข้อมูลในตาราง 'categories'
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: body.name,              // อัปเดตชื่อใหม่
        description: body.description, // อัปเดตรายละเอียดใหม่
        updated_at: new Date().toISOString(), // บันทึกเวลาที่ทำการแก้ไขล่าสุด
      })
      .eq('id', id)  // เงื่อนไข: ต้องเป็นแถวที่มี id ตรงกับใน URL เท่านั้น
      .select()      // ดึงข้อมูลแถวที่แก้ไขแล้วกลับมาด้วย
      .single()      // ยืนยันว่าคืนค่าเป็น Object ชิ้นเดียว

    // 4. หากเกิด Error ระหว่างอัปเดต ให้กระโดดไปส่วน catch
    if (error) throw error
    
    // 5. ส่งข้อมูลหมวดหมู่ที่อัปเดตเรียบร้อยแล้วกลับไป
    return NextResponse.json(data)
    
  } catch (error: any) {
    // จัดการข้อผิดพลาดและส่ง Status 500 กลับไป
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * [METHOD: DELETE]
 * หน้าที่: ลบหมวดหมู่บอร์ดเกมออกจากระบบตาม ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. รอรับค่า id จากพารามิเตอร์ URL
    const { id } = await params
    const supabase = await createClient()

    // 2. สั่งลบแถวในตาราง 'categories' ที่มี id ตรงกัน
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id) // สำคัญ: ต้องระบุ ID เพื่อไม่ให้ลบผิดแถว

    // 3. หากเกิด Error (เช่น มีเกมในระบบที่ยังใช้หมวดหมู่นี้อยู่) ให้แจ้ง Error
    if (error) throw error
    
    // 4. หากลบสำเร็จ ส่งสถานะ success กลับไป
    return NextResponse.json({ success: true })
    
  } catch (error: any) {
    // ส่ง Error Message กลับไปให้ Frontend จัดการแสดงผล
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}