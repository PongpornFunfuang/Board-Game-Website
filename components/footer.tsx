import { Dice5, Facebook, Phone, MapPin, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Dice5 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">NTER Board Game Cafe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              สวรรค์ของคนรักบอร์ดเกม - มีเกมให้เลือกหลากหลายประเภท
            </p>
          </div>

          {/* Links */}
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

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">ติดต่อเรา</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>092 614 2919</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Facebook className="h-4 w-4" />
                <span>NTER Board Game Cafe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>@ntercafe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>42/16 ถ.อำมาตย์ ต.ในเมือง อ.เมือง จ.ขอนแก่น, Khon Kaen, Thailand</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NTER Board Game Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
