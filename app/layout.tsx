/**
 * ไฟล์: Board-Game-Website/app/layout.tsx
 * หน้าที่: เป็นโครงสร้างหลัก (Root Layout) ของทั้งเว็บไซต์ 
 * ทุกหน้าในเว็บจะถูกนำมาวางไว้ข้างในไฟล์นี้ เพื่อให้มี Font, SEO และการตั้งค่าพื้นฐานที่เหมือนกัน
 */

// --- [SECTION: IMPORT] นำเข้าเครื่องมือพื้นฐาน ---
import type { Metadata } from 'next' // เครื่องมือสำหรับตั้งค่าข้อมูลเว็บ (เช่น ชื่อเว็บที่โชว์บน Google)
import { Geist, Geist_Mono } from 'next/font/google' // นำเข้าฟอนต์จาก Google Fonts เพื่อใช้ในเว็บ
import { Analytics } from '@vercel/analytics/next' // เครื่องมือเก็บสถิติผู้เข้าชมเว็บของ Vercel
import './globals.css' // นำเข้าไฟล์ CSS หลัก (Tailwind) เพื่อให้ทั้งเว็บมีสไตล์ตามที่กำหนดไว้

// --- [SECTION: FONT SETTINGS] ตั้งค่าฟอนต์ ---
// กำหนดฟอนต์ Geist สำหรับตัวอักษรปกติ และ Geist Mono สำหรับตัวอักษรแบบรหัสโค้ด
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

/**
 * Metadata: ส่วนข้อมูลที่ "User มองไม่เห็นบนหน้าเว็บ" แต่ "Search Engine และ Browser เห็น"
 * หน้าที่: ช่วยเรื่อง SEO (ทำให้คนค้นหาเจอใน Google) และตั้งค่า Icon ของเว็บ
 */
export const metadata: Metadata = {
  title: 'NTER Board Game Cafe - สวรรค์ของคนรักบอร์ดเกม', // ชื่อที่จะปรากฏบน Tab ของ Browser
  description: 'ร้านบอร์ดเกมครบวงจร มีเกมวางแผน เกมปาร์ตี้ เกมครอบครัว เกมการ์ด และอีกมากมาย', // คำอธิบายเว็บเวลาแชร์ลิงก์
  generator: 'v0.app', // ระบุว่าเว็บนี้สร้างเบื้องต้นด้วยเครื่องมือใด
  
  // icons: ตั้งค่ารูปไอคอนเล็กๆ บน Tab (Favicon) และไอคอนสำหรับ iPhone (Apple Icon)
  icons: {
    icon: [
      {
        url: '/LOGO.jpg',
        media: '(prefers-color-scheme: light)', // ไอคอนที่จะโชว์เมื่อ User ใช้เครื่องโหมดสว่าง (Light Mode)
      },
      {
        url: '/LOGO.jpg',
        media: '(prefers-color-scheme: dark)',  // ไอคอนที่จะโชว์เมื่อ User ใช้เครื่องโหมดมืด (Dark Mode)
      },
      {
        url: '/LOGO.jpg',
        type: 'image/svg+xml', // ไอคอนหลักแบบไฟล์ Vector (ชัดทุกขนาด)
      },
    ],
    apple: '/LOGO.jpg', // ไอคอนเวลาคน Save หน้าเว็บไว้บนหน้าจอ iPhone
  },
}

/**
 * RootLayout: ฟังก์ชันหลักที่จะ "ครอบ" ทุกหน้าเว็บเอาไว้
 */
export default function RootLayout({
  children, // 'children' คือเนื้อหาของหน้าเว็บแต่ละหน้า (เช่น page.tsx ที่เราดูไปก่อนหน้านี้)
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // lang="th": บอก Browser ว่าเว็บนี้เนื้อหาหลักคือภาษาไทย (ช่วยเรื่อง SEO และการแปลภาษา)
    <html lang="th">
      {/* className="font-sans antialiased": 
        - font-sans: บังคับใช้ฟอนต์แบบไม่มีหัว (ดูทันสมัย)
        - antialiased: ทำให้ตัวอักษรดูเรียบเนียน ไม่แตกเป็นพิกเซลบนจอ Mac/iOS
      */}
      <body className="font-sans antialiased">
        {/* เนื้อหาจากหน้า page.tsx หรือหน้าอื่นๆ จะถูกนำมาวางแสดงผลตรงนี้ */}
        {children}
        
        {/* Analytics: ระบบแอบเก็บสถิติว่ามีคนเข้าเว็บกี่คน มาจากจังหวัดไหน (มองไม่เห็นบนหน้าเว็บ) */}
        <Analytics />
      </body>
    </html>
  )
}