/**
 * ไฟล์: Board-Game-Website/components/header.tsx
 * หน้าที่: ส่วนหัวของเว็บไซต์ (Navigation Bar) ที่แสดงผลทุกหน้า
 * การทำงาน: 
 * - รองรับ Responsive (Desktop แสดงแนวนอน, Mobile แสดงเมนูแบบ Hamburger)
 * - มีเอฟเฟกต์ Sticky (ติดขอบบน) และ Backdrop Blur (โปร่งแสงเบลอ)
 */

'use client' // กำหนดเป็น Client Component เพราะมีการใช้ State และ Interaction (คลิกเมนู)

import Link from 'next/link'
import { Dice5, Menu, X } from 'lucide-react' // ไอคอนจาก lucide-react
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Header() {
  // state สำหรับเปิด-ปิดเมนูบนหน้าจอมือถือ
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    // header: กำหนดให้ติดขอบบน (sticky) และมีเอฟเฟกต์เบลอพื้นหลัง (backdrop-blur)
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* --- โลโก้และชื่อร้าน --- */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/LOGO.jpg"
            alt="Dice5 Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-bold">NTER Board Game Cafe</span>
        </Link>

        {/* --- Desktop Navigation: แสดงเฉพาะหน้าจอขนาดกลาง (md) ขึ้นไป --- */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            หน้าแรก
          </Link>
          <Link href="/games" className="text-sm font-medium hover:text-primary transition-colors">
            บอร์ดเกมทั้งหมด
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            หมวดหมู่
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            ติดต่อเรา
          </Link>
          {/* ปุ่มสำหรับเข้าหน้าจัดการ (Admin) */}
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </nav>

        {/* --- ปุ่มเปิดเมนูมือถือ (Hamburger Button): แสดงเฉพาะหน้าจอเล็กกว่า md --- */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // สลับสถานะเปิด/ปิด
        >
          {/* ถ้าเมนูเปิดอยู่แสดงไอคอน X (กากบาท) ถ้าปิดอยู่แสดง Menu (สามขีด) */}
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* --- Mobile Navigation: แถบเมนูที่จะเลื่อนลงมาเมื่อ mobileMenuOpen เป็น true --- */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            {/* เมื่อคลิกลิงก์ในมือถือ จะสั่ง setMobileMenuOpen(false) เพื่อปิดแถบเมนูอัตโนมัติ */}
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              หน้าแรก
            </Link>
            <Link
              href="/games"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              บอร์ดเกมทั้งหมด
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              หมวดหมู่
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ติดต่อเรา
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}