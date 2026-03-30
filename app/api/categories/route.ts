/**
 * ไฟล์: Board-Game-Website/app/api/categories/route.ts
 * หน้าที่: API Endpoint สำหรับจัดการข้อมูลหมวดหมู่ (CRUD - Create & Read)
 * เส้นทาง: /api/categories
 */

import { createClient } from '@/lib/supabase/server' // นำเข้าฟังก์ชันเชื่อมต่อ Supabase ฝั่ง Server
import { NextRequest, NextResponse } from 'next/server' // เครื่องมือจัดการ HTTP Request และ Response ของ Next.js

/**
 * [METHOD: GET]
 * หน้าที่: ดึงรายการหมวดหมู่ทั้งหมดจากฐานข้อมูล
 */
export async function GET() {
  // 1. เริ่มต้นการเชื่อมต่อกับ Supabase
  const supabase = await createClient()

  // 2. Query ข้อมูลจากตาราง 'categories'
  const { data, error } = await supabase
    .from('categories') // ระบุชื่อตาราง
    .select('*')        // เลือกดึงทุกคอลัมน์ (id, name, description, created_at)
    .order('created_at', { ascending: false }) // จัดเรียงข้อมูล: ให้รายการที่เพิ่งสร้างล่าสุดอยู่ด้านบนสุด

  // 3. ตรวจสอบข้อผิดพลาดในการดึงข้อมูล
  if (error) {
    // หากเกิด Error ส่ง JSON ข้อความ Error กลับไปพร้อม Status 500 (Server Error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. หากสำเร็จ ส่งข้อมูลหมวดหมู่ทั้งหมดกลับไปให้ผู้เรียก (เช่น หน้า Categories หรือ Admin Dashboard)
  return NextResponse.json(data)
}

/**
 * [METHOD: POST]
 * หน้าที่: เพิ่มหมวดหมู่บอร์ดเกมใหม่ลงในระบบ
 */
export async function POST(request: NextRequest) {
  try {
    // 1. เริ่มต้นการเชื่อมต่อกับ Supabase
    const supabase = await createClient()
    
    // 2. รับข้อมูล JSON ที่ส่งมาจากหน้าบ้าน (Body)
    const body = await request.json()

    // 3. บันทึกข้อมูลใหม่ลงในตาราง 'categories'
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name: body.name,              // ชื่อหมวดหมู่ (เช่น เกมวางแผน, เกมปาร์ตี้)
          description: body.description, // รายละเอียดของหมวดหมู่นั้นๆ
        },
      ])
      .select() // สั่งให้ส่งข้อมูลแถวที่เพิ่งบันทึกสำเร็จกลับมาด้วย
      .single() // ระบุว่าผลลัพธ์ที่ได้ต้องเป็น Object ชุดเดียว

    // 4. ถ้ามี Error จาก Supabase ให้โยน (throw) ไปที่ส่วน catch
    if (error) throw error
    
    // 5. ส่งข้อมูลหมวดหมู่ที่เพิ่งสร้างสำเร็จกลับไปให้ Frontend
    return NextResponse.json(data)
    
  } catch (error: any) {
    // จัดการข้อผิดพลาดที่เกิดขึ้นใน Try block (เช่น JSON ผิดรูปแบบ หรือ DB ปฏิเสธการบันทึก)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}