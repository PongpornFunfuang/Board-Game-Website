/**
 * ไฟล์: Board-Game-Website/components/footer.tsx
 * หน้าที่: แสดงส่วนท้ายของเว็บไซต์ (Footer) 
 * การทำงาน: สรุปข้อมูลแบรนด์, ลิงก์ด่วน (Quick Links), และข้อมูลการติดต่อ
 */

import { Dice5, Facebook, Phone, MapPin, MessageCircle } from 'lucide-react' // ไอคอนต่างๆ
import Link from 'next/link'

export function Footer() {
  return (
    // footer: กำหนดเส้นขอบบน (border-t) และใช้สีพื้นหลังแบบหม่น (bg-muted/50) เพื่อแยกส่วนจากเนื้อหาหลัก
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        {/* ใช้ Grid System: 1 คอลัมน์บนมือถือ และ 3 คอลัมน์บนหน้าจอขนาดกลาง (md) ขึ้นไป */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* --- [SECTION 1: BRAND] --- */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/LOGO.jpg"
                alt="Dice5 Logo"
                className="h-8 w-8 object-contain"
              /> {/* โลโก้ลูกเต๋า */}
              <span className="text-xl font-bold">NTER Board Game Cafe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              สวรรค์ของคนรักบอร์ดเกม - มีเกมให้เลือกหลากหลายประเภท
            </p>
          </div>

          {/* --- [SECTION 2: QUICK LINKS] --- */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">ลิงก์ด่วน</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/games" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                บอร์ดเกมทั้งหมด
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                หมวดหมู่
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ติดต่อเรา
              </Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                สำหรับแอดมิน
              </Link>
            </nav>
          </div>

          {/* --- [SECTION 3: CONTACT INFO] --- */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">ติดต่อเรา</h3>
            <div className="flex flex-col gap-3">
              {/* เบอร์โทรศัพท์ */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>092 614 2919</span>
              </div>
              {/* Facebook */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Facebook className="h-4 w-4" />
                <span>NTER Board Game Cafe</span>
              </div>
              {/* Line หรือ Messenger */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>@ntercafe</span>
              </div>
              {/* ที่อยู่ร้าน (Address) */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" /> {/* flex-shrink-0 กันไอคอนเบี้ยวเมื่อข้อความยาว */}
                <span>42/16 ถ.อำมาตย์ ต.ในเมือง อ.เมือง จ.ขอนแก่น, Khon Kaen, Thailand</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- [BOTTOM BAR: COPYRIGHT] --- */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          {/* ใช้ new Date().getFullYear() เพื่อให้ปีคริสต์ศักราชอัปเดตอัตโนมัติทุกปี */}
          <p>&copy; {new Date().getFullYear()} NTER Board Game Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}