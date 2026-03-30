/**
 * ไฟล์: Board-Game-Website/lib/types.ts
 * หน้าที่: กำหนดโครงสร้างข้อมูล (Type Definitions) ทั้งหมดที่ใช้ในเว็บไซต์
 * ประโยชน์: ช่วยให้เกิด Type Safety ลดข้อผิดพลาดในการเขียนโปรแกรม และทำให้ระบบ Auto-complete ทำงานได้แม่นยำ
 */

/**
 * Category Interface: โครงสร้างข้อมูลของ "หมวดหมู่บอร์ดเกม"
 */
export interface Category {
  id: string              // รหัสประจำตัวหมวดหมู่ (Primary Key)
  name: string            // ชื่อหมวดหมู่ (เช่น Party, Strategy)
  description: string | null // รายละเอียดหมวดหมู่ (อนุญาตให้เป็นค่าว่างได้)
  created_at: string      // วันที่สร้างข้อมูล
  updated_at: string      // วันที่แก้ไขข้อมูลล่าสุด
}

/**
 * BoardGame Interface: โครงสร้างข้อมูลของ "ตัวเกมบอร์ดเกม"
 */
export interface BoardGame {
  id: string              // รหัสประจำตัวเกม
  name: string            // ชื่อบอร์ดเกม
  description: string | null // รายละเอียดของเกม
  image_url: string | null   // ลิงก์รูปภาพหน้าปกเกม
  category_id: string | null // ID ที่เชื่อมโยงกับหมวดหมู่ (Foreign Key)
  min_players: number     // จำนวนผู้เล่นขั้นต่ำ
  max_players: number     // จำนวนผู้เล่นสูงสุด
  play_time: string | null   // ระยะเวลาที่ใช้เล่น (เช่น "30-60 นาที")
  created_at: string      // วันที่เพิ่มเกมเข้าระบบ
  updated_at: string      // วันที่แก้ไขข้อมูลเกมล่าสุด
  
  // ข้อมูลหมวดหมู่แบบเต็ม (Optional) 
  // มักจะมาจากการ Join Table ในฐานข้อมูล เพื่อให้เรียกใช้ game.category.name ได้เลย
  category?: Category     
}

/**
 * StoreInfo Interface: โครงสร้างข้อมูล "รายละเอียดร้าน"
 * ใช้สำหรับจัดการข้อมูลติดต่อที่แสดงผลในหน้า Contact หรือ Footer
 */
export interface StoreInfo {
  id: string              // รหัสประจำตัวข้อมูลร้าน
  name: string            // ชื่อร้าน (NTER Board Game Cafe)
  slogan: string | null   // สโลแกนหรือคำโปรยของร้าน
  phone: string | null    // เบอร์โทรศัพท์ติดต่อ
  facebook: string | null // ชื่อเพจ หรือลิงก์ Facebook
  line_id: string | null  // ID Line สำหรับติดต่อ
  google_maps_url: string | null // ลิงก์พิกัดร้านบน Google Maps
  address: string | null  // ที่อยู่แบบละเอียดของร้าน
  created_at: string
  updated_at: string
}