/**
 * ไฟล์: Board-Game-Website/app/admin/page.tsx
 * หน้าที่: หน้าเข้าสู่ระบบสำหรับ Admin (Admin Login Page)
 * รูปแบบการทำงาน: Client Component (เพราะมีการใช้ Form, State และ Browser API)
 */

'use client' // กำหนดให้ไฟล์นี้เป็น Client Component

import { useState } from 'react' // ใช้สำหรับเก็บค่าใน Form และสถานะการทำงาน
import { useRouter } from 'next/navigation' // ใช้สำหรับเปลี่ยนหน้าไปยัง Dashboard หลัง Login สำเร็จ
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card' // UI Card
import { Button } from '@/components/ui/button' // UI Button
import { Input } from '@/components/ui/input'   // UI Input
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field' // UI สำหรับจัดกลุ่มฟิลด์กรอกข้อมูล
import { Dice5, Lock, Mail, Loader2 } from 'lucide-react' // ไอคอนต่างๆ
import Link from 'next/link' // สำหรับสร้างลิงก์ที่โหลดหน้าแบบเร็ว (SPA)
import { createClient } from '@/lib/supabase/client' // ตัวเชื่อมต่อ Supabase ฝั่ง Client

export default function AdminLoginPage() {
  const router = useRouter() // สร้าง instance สำหรับการนำทาง

  // --- [STATE MANAGEMENT] ---
  const [email, setEmail] = useState('')      // เก็บค่าอีเมลที่กรอก
  const [password, setPassword] = useState('') // เก็บค่ารหัสผ่านที่กรอก
  const [loading, setLoading] = useState(false) // สถานะกำลังประมวลผล (กดปุ่มแล้วรอ)
  const [error, setError] = useState('')        // เก็บข้อความแสดงข้อผิดพลาด

  /**
   * handleLogin: ฟังก์ชันจัดการการส่งฟอร์มเข้าสู่ระบบ
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // ป้องกันไม่ให้ Browser รีโหลดหน้าเว็บเองเมื่อกด Submit

    if (loading) return // ถ้ากำลังโหลดอยู่ ไม่ให้ส่งซ้ำ

    setLoading(true) // เริ่มต้นสถานะการโหลด
    setError('')     // ล้างข้อความ Error เก่าออกก่อน

    // ตรวจสอบเบื้องต้น (Validation)
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient() // เรียกใช้งาน Supabase Client

      // ส่งคำขอเข้าสู่ระบบไปยัง Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      // หาก Supabase แจ้งว่าผิดพลาด (เช่น รหัสผ่านผิด)
      if (error) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        return
      }

      // หากสำเร็จ: ส่งผู้ใช้ไปหน้า Dashboard และ Refresh ข้อมูล Middleware
      router.push('/admin/dashboard')
      router.refresh()

    } catch (err) {
      console.error('Login error:', err)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false) // จบสถานะการโหลดไม่ว่าจะสำเร็จหรือไม่
    }
  }

  return (
    // จัด Layout กึ่งกลางหน้าจอ: items-center justify-center
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">

        {/* ส่วนหัว: โลโก้และชื่อร้าน */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Dice5 className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">NTER Board Game Cafe</span>
          </Link>
          <p className="text-muted-foreground">ระบบจัดการหลังบ้าน</p>
        </div>

        {/* บล็อกฟอร์มเข้าสู่ระบบ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              เข้าสู่ระบบ Admin
            </CardTitle>
            <CardDescription>
              กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin}>
              <FieldGroup>

                {/* ฟิลด์อีเมล */}
                <Field>
                  <FieldLabel htmlFor="email">อีเมล</FieldLabel>
                  <div className="relative">
                    {/* ไอคอน Mail อยู่ด้านหน้า input (ใช้ absolute) */}
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} // อัปเดต state เมื่อพิมพ์
                      className="pl-10" // เผื่อระยะด้านซ้ายให้ไอคอน
                      required
                    />
                  </div>
                </Field>

                {/* ฟิลด์รหัสผ่าน */}
                <Field>
                  <FieldLabel htmlFor="password">รหัสผ่าน</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </Field>

                {/* แสดงข้อความ Error ถ้ามี */}
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                {/* ปุ่มเข้าสู่ระบบ: เปลี่ยนหน้าตาตามสถานะ loading */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    'เข้าสู่ระบบ'
                  )}
                </Button>

              </FieldGroup>
            </form>

            {/* ส่วนเสริมด้านล่างฟอร์ม */}
            <div className="mt-6 pt-6 border-t text-center space-y-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary block"
              >
                กลับไปหน้าหลัก
              </Link>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}