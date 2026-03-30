/**
 * ไฟล์: Board-Game-Website/lib/supabase/client.ts
 * หน้าที่: สร้าง Supabase Client สำหรับใช้งานใน Client Components
 * การทำงาน: ใช้เชื่อมต่อกับ Supabase จากฝั่ง Browser (Frontend) 
 * เพื่อทำงานที่ต้องมีการโต้ตอบกับผู้ใช้ เช่น การส่งฟอร์ม, การกดยอมรับข้อตกลง หรือการดึงข้อมูลแบบ Real-time
 */

import { createBrowserClient } from '@supabase/ssr' // Library สำหรับจัดการ Supabase บนฝั่ง Browser

/**
 * createClient: ฟังก์ชันสำหรับสร้างการเชื่อมต่อกับ Supabase จากฝั่ง Client
 */
export function createClient() {
  // สร้างและส่งค่า Browser Client กลับออกไป
  return createBrowserClient(
    // ดึง URL และ Anon Key จาก Environment Variables
    // (ใช้เครื่องหมาย ! เพื่อยืนยันว่าเราตั้งค่าในไฟล์ .env เรียบร้อยแล้ว)
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}