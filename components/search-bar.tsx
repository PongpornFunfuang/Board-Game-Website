/**
 * ไฟล์: Board-Game-Website/components/search-bar.tsx
 * หน้าที่: คอมโพเนนต์ช่องค้นหา (Search Bar) แบบ Reusable
 * การทำงาน: รับค่าจากผู้ใช้และส่งต่อเหตุการณ์ (Event) การค้นหากลับไปยัง Component พ่อ (Parent)
 */

'use client' // ต้องเป็น Client Component เพราะมีการใช้ Event Handling (onSubmit, onChange)

import { Search } from 'lucide-react' // ไอคอนแว่นขยาย
import { Input } from '@/components/ui/input' // คอมโพเนนต์ Input จาก shadcn/ui
import { Button } from '@/components/ui/button' // คอมโพเนนต์ Button จาก shadcn/ui

// --- [INTERFACE DEFINITION] ---
// กำหนดโครงสร้างของ Props ที่คอมโพเนนต์นี้ต้องการ
interface SearchBarProps {
  value: string              // ค่าข้อความในช่องค้นหา
  onChange: (value: string) => void // ฟังก์ชันที่จะทำงานเมื่อข้อความเปลี่ยน
  onSearch: () => void       // ฟังก์ชันที่จะทำงานเมื่อกดปุ่มค้นหา หรือ Enter
  placeholder?: string       // ข้อความตัวอย่างในช่อง (Optional)
}

export function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = 'ค้นหาบอร์ดเกม...' // กำหนดค่าเริ่มต้นให้ placeholder
}: SearchBarProps) {

  /**
   * handleSubmit: จัดการเมื่อมีการกดส่งฟอร์ม (กดปุ่มหรือ Enter)
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // ป้องกันไม่ให้ Browser รีเฟรชหน้าเว็บเมื่อส่งฟอร์ม
    onSearch()         // เรียกใช้ฟังก์ชันค้นหาที่ส่งมาจาก Parent
  }

  return (
    // ใช้แท็ก <form> เพื่อให้รองรับการกด Enter เพื่อค้นหาได้โดยอัตโนมัติ
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        {/* ไอคอน Search วางแบบ absolute ทับอยู่บน Input */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          // เมื่อพิมพ์ ให้ส่งค่ากลับไปอัปเดต state ที่อยู่ด้านนอก (Parent)
          onChange={(e) => onChange(e.target.value)}
          // ขยับ padding ซ้าย (pl-10) เพื่อไม่ให้ข้อความพิมพ์ทับไอคอนแว่นขยาย
          className="pl-10"
        />
      </div>
      
      {/* ปุ่มกดเพื่อยืนยันการค้นหา */}
      <Button type="submit">ค้นหา</Button>
    </form>
  )
}