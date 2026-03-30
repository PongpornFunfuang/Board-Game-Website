/**
 * ไฟล์: Board-Game-Website/app/api/store/route.ts
 * หน้าที่: API Endpoint สำหรับดึงข้อมูลรายละเอียดร้านค้า (Store Information)
 * วิธีใช้งาน: เรียกผ่าน /api/store ด้วย Method GET
 */

import { createClient } from '@/lib/supabase/server' // นำเข้าฟังก์ชันเชื่อมต่อ Supabase ฝั่ง Server
import { NextResponse } from 'next/server'           // เครื่องมือของ Next.js สำหรับส่ง Response กลับไป (เช่น JSON)

/**
 * ฟังก์ชัน GET: จัดการ HTTP GET Request
 * หน้าที่: ดึงข้อมูลจากตาราง 'store_info' แล้วส่งกลับเป็น JSON
 */
export async function GET() {
  // 1. สร้างตัวแปร supabase เพื่อเตรียมติดต่อกับฐานข้อมูล
  const supabase = await createClient()

  // 2. เริ่มคำสั่งดึงข้อมูล (Query)
  const { data, error } = await supabase
    .from('store_info') // ระบุชื่อตารางที่ต้องการ (store_info)
    .select('*')        // เลือกเอามาทุกคอลัมน์
    .limit(1)           // จำกัดให้เอามาแค่ 1 รายการ (เนื่องจากข้อมูลร้านค้ามักมีแถวเดียว)
    .single()           // ยืนยันว่าผลลัพธ์ที่ได้ต้องเป็น Object ก้อนเดียว (ไม่ใช่ Array)

  // 3. ตรวจสอบว่าเกิด Error ในการดึงข้อมูลหรือไม่ (เช่น ตารางไม่มีอยู่จริง, DB ล่ม)
  if (error) {
    // ส่ง Error Message กลับไปพร้อม HTTP Status 500 (Internal Server Error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. หากสำเร็จ ส่งข้อมูลร้านค้ากลับไปในรูปแบบ JSON (Status 200 - OK โดยอัตโนมัติ)
  return NextResponse.json(data)
}