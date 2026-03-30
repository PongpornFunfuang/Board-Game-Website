/**
 * ไฟล์: Board-Game-Website/app/admin/dashboard/layout.tsx
 * หน้าที่: กำหนดโครงสร้างหน้าจอ (Sidebar/Navigation) และตรวจสอบสิทธิ์เข้าถึง (Authentication Guard)
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client' // เชื่อมต่อ Supabase ฝั่ง Client
import { Button } from '@/components/ui/button'
import { Dice5, LayoutDashboard, Gamepad2, FolderTree, LogOut, Menu, X } from 'lucide-react'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  
  // loading: ใช้รอตรวจสอบว่าผู้ใช้ล็อกอินอยู่จริงไหม ก่อนจะยอมให้เห็นเนื้อหาด้านใน
  const [loading, setLoading] = useState(true)
  // sidebarOpen: ควบคุมการเปิด-ปิดเมนู Sidebar ในหน้าจอมือถือ
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /**
   * [AUTH CHECK]
   * useEffect นี้จะทำงานทันทีที่หน้า Dashboard ถูกเรียก
   */
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      // ดึงข้อมูล Session ปัจจุบันจาก Supabase
      const { data: { session } } = await supabase.auth.getSession()

      // ถ้าไม่มี Session (ไม่ได้ล็อกอิน) ให้ดีดกลับไปหน้าล็อกอินหลัก (/admin) ทันที
      if (!session) {
        router.push('/admin')
        return
      }

      // ถ้าล็อกอินแล้ว ให้เลิกโหลดและแสดงเนื้อหา (children)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  /**
   * handleLogout: ฟังก์ชันสำหรับออกจากระบบ
   */
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut() // สั่ง Supabase ให้ทำลาย Session
    router.push('/admin') // เด้งกลับหน้าล็อกอิน
  }

  // ระหว่างที่รอเช็ค Auth ให้แสดงวงกลมหมุนๆ (Loading Spinner) กลางหน้าจอ
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // รายการเมนูบน Sidebar เพื่อให้ง่ายต่อการเพิ่ม/แก้ไขในอนาคต
  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/dashboard/games', icon: Gamepad2, label: 'จัดการบอร์ดเกม' },
    { href: '/admin/dashboard/categories', icon: FolderTree, label: 'จัดการหมวดหมู่' },
  ]

  return (
    <div className="min-h-screen flex">
      {/*ปุ่มเปิดเมนู (Hamburger Menu) - แสดงเฉพาะบนมือถือ (lg:hidden) */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* [SIDEBAR]
          บนคอมพิวเตอร์ (lg) จะค้างไว้ด้านซ้าย
          บนมือถือ จะซ่อนไว้และสไลด์ออกมาเมื่อ sidebarOpen เป็น true
      */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r transform transition-transform duration-200 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* ส่วนหัว Sidebar: โลโก้และชื่อ */}
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Dice5 className="h-8 w-8 text-primary" />
              <span className="font-bold">Admin Panel</span>
            </Link>
          </div>

          {/* รายการเมนูหลัก */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
                    onClick={() => setSidebarOpen(false)} // คลิกแล้วให้ปิดเมนู (กรณีมือถือ)
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ปุ่มออกจากระบบ (อยู่ล่างสุดของ Sidebar) */}
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </aside>

      {/* [MAIN CONTENT]
          ส่วนที่จะแสดงเนื้อหาจากหน้าย่อยต่างๆ (children)
          บนคอมฯ จะขยับซ้ายหลบ Sidebar (lg:ml-64)
      */}
      <main className="flex-1 lg:ml-64">
        <div className="p-8 pt-16 lg:pt-8">
          {children} {/* นี่คือจุดที่ไฟล์ page.tsx ของหน้าต่างๆ จะมาแสดงผล */}
        </div>
      </main>

      {/* Overlay: พื้นหลังสีดำจางๆ เมื่อเปิด Sidebar บนมือถือ เพื่อให้ปิดง่ายขึ้นเมื่อแตะพื้นที่ว่าง */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}