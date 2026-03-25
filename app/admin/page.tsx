'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Dice5, Lock, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        return
      }

      router.push('/admin/dashboard')
      router.refresh()

    } catch (err) {
      console.error('Login error:', err)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Dice5 className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Board Game Paradise</span>
          </Link>
          <p className="text-muted-foreground">ระบบจัดการหลังบ้าน</p>
        </div>

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

                <Field>
                  <FieldLabel htmlFor="email">อีเมล</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </Field>

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

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

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

            <div className="mt-6 pt-6 border-t text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                ยังไม่มีบัญชี?{' '}
                <Link href="/admin/signup" className="text-primary hover:underline">
                  สมัครบัญชี Admin
                </Link>
              </p>

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
