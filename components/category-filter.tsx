/**
 * ไฟล์: Board-Game-Website/components/category-filter.tsx
 * หน้าที่: แถบปุ่มสำหรับกรองบอร์ดเกมตามหมวดหมู่ (Category Filtering Tabs)
 * การทำงาน: รับรายการหมวดหมู่มาสร้างเป็นปุ่ม และส่งค่าหมวดหมู่ที่เลือกกลับไปยังตัวควบคุมหลัก
 */

'use client' // ต้องเป็น Client Component เพราะมีการคลิก (Interaction)

import { Button } from '@/components/ui/button'
import type { Category } from '@/lib/types'

// --- [INTERFACE DEFINITION] ---
interface CategoryFilterProps {
  categories: Category[]             // รายการหมวดหมู่ทั้งหมดที่ดึงมาจาก Database
  selectedCategory: string | null    // ID ของหมวดหมู่ที่กำลังเลือกอยู่ในขณะนั้น (ถ้าเป็น null แปลว่าเลือก "ทั้งหมด")
  onSelect: (categoryId: string | null) => void // ฟังก์ชันสำหรับส่งค่า ID ที่คลิกกลับไปหา Parent
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    // flex-wrap ช่วยให้ปุ่มขึ้นบรรทัดใหม่ได้หากหน้าจอแคบ (เช่น บนมือถือ)
    <div className="flex flex-wrap gap-2">
      
      {/* --- [ปุ่ม "ทั้งหมด"] --- */}
      <Button
        // ถ้า selectedCategory เป็น null ให้ใช้ปุ่มสีหลัก (default) ถ้าไม่ใช่ให้ใช้แบบเส้นขอบ (outline)
        variant={selectedCategory === null ? 'default' : 'outline'}
        size="sm"
        // เมื่อคลิก จะส่งค่า null กลับไปเพื่อยกเลิกการกรองทุกหมวดหมู่
        onClick={() => onSelect(null)}
      >
        ทั้งหมด
      </Button>

      {/* --- [รายการปุ่มหมวดหมู่จากข้อมูล] --- */}
      {categories.map((category) => (
        <Button
          key={category.id} // ต้องใส่ key เสมอเมื่อมีการ map ใน React
          // ตรวจสอบว่า ID ของปุ่มนี้ตรงกับที่เลือกอยู่หรือไม่ เพื่อทำ Highlight สีปุ่ม
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          size="sm"
          // เมื่อคลิก จะส่ง ID ของหมวดหมู่นี้กลับไป
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}