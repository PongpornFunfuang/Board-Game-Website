/**
 * ไฟล์: Board-Game-Website/app/admin/dashboard/page.tsx
 * หน้าที่: หน้าแรกของระบบหลังบ้าน (Admin Dashboard Overview)
 * รูปแบบการทำงาน: Client Component ใช้ดึงข้อมูลสถิติจาก API มาแสดงผล
 */

'use client'

import { useEffect, useState } from 'react' // ใช้สำหรับจัดการ Side Effect และเก็บสถานะข้อมูล
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card' // UI Card จาก Shadcn/ui
import { Gamepad2, FolderTree, Eye } from 'lucide-react' // ไอคอนประกอบ
import Link from 'next/link' // สำหรับสร้างการเชื่อมต่อภายในแอป

export default function AdminDashboardPage() {
  // --- [STATE MANAGEMENT] ---
  // stats: เก็บจำนวนตัวเลขสถิติที่จะแสดงบนหน้า Dashboard
  const [stats, setStats] = useState({ games: 0, categories: 0 })
  // loading: สถานะการโหลดข้อมูลจาก API
  const [loading, setLoading] = useState(true)

  /**
   * useEffect: ทำการดึงข้อมูลสถิติเมื่อ Component ถูกโหลดครั้งแรก
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ใช้ Promise.all เพื่อดึงข้อมูลจาก API สองแห่งพร้อมกัน (เพื่อความรวดเร็ว)
        const [gamesRes, categoriesRes] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/categories')
        ])

        const games = await gamesRes.json()
        const categories = await categoriesRes.json()

        // ตรวจสอบว่าเป็น Array หรือไม่ แล้วนับจำนวน (.length) เพื่อนำไปแสดงผล
        setStats({
          games: Array.isArray(games) ? games.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false) // ปิดสถานะการโหลด
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      {/* ส่วนหัวของหน้า Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">ยินดีต้อนรับสู่ระบบจัดการหลังบ้าน</p>
      </div>

      {/* --- [SECTION: SUMMARY CARDS] ---
          แสดงตัวเลขสถิติภาพรวมในรูปแบบ Grid 3 คอลัมน์ (บน Desktop)
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* การ์ดแสดงจำนวนบอร์ดเกม */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">บอร์ดเกมทั้งหมด</CardTitle>
            <Gamepad2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '...' : stats.games} {/* แสดง ... ขณะกำลังโหลด */}
            </div>
            <p className="text-xs text-muted-foreground mt-1">เกมในระบบ</p>
          </CardContent>
        </Card>

        {/* การ์ดแสดงจำนวนหมวดหมู่ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">หมวดหมู่ทั้งหมด</CardTitle>
            <FolderTree className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? '...' : stats.categories}
            </div>
            <p className="text-xs text-muted-foreground mt-1">หมวดหมู่ในระบบ</p>
          </CardContent>
        </Card>

        {/* การ์ดทางลัดเปิดหน้าเว็บไซต์หลัก (เปิด Tab ใหม่) */}
        <Link href="/" target="_blank">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">เว็บไซต์หลัก</CardTitle>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium text-primary">ดูเว็บไซต์</div>
              <p className="text-xs text-muted-foreground mt-1">เปิดหน้าเว็บไซต์</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* --- [SECTION: NAVIGATION CARDS] ---
          เมนูหลักสำหรับการจัดการข้อมูล แบ่งเป็น 2 ฝั่งใหญ่ๆ
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ลิงก์ไปยังหน้าจัดการบอร์ดเกม */}
        <Link href="/admin/dashboard/games">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>จัดการบอร์ดเกม</CardTitle>
                  <CardDescription>เพิ่ม แก้ไข ลบ บอร์ดเกม</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        {/* ลิงก์ไปยังหน้าจัดการหมวดหมู่ */}
        <Link href="/admin/dashboard/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <FolderTree className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>จัดการหมวดหมู่</CardTitle>
                  <CardDescription>เพิ่ม แก้ไข ลบ หมวดหมู่</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}