'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Dice5, Lock, Mail, Loader2, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AdminSignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      setLoading(false)
      return
    }

    console.log('[v0] Starting signup with email:', email)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`
        }
      })

      console.log('[v0] Signup response:', { data, error })

      if (error) {
        console.log('[v0] Signup error:', error.message)
        setError('ไม่สามารถสมัครได้: ' + error.message)
        return
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccess(true)
      } else if (data.session) {
        // Auto logged in
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.log('[v0] Catch error:', err)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">สมัครสำเร็จ!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการสมัคร</p>
              <p className="text-sm text-muted-foreground mb-6">
                หลังจากยืนยันอีเมลแล้ว คุณสามารถเข้าสู่ระบบได้
              </p>
              <Link href="/admin">
                <Button>กลับไปหน้าเข้าสู่ระบบ</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Dice5 className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Board Game Paradise</span>
          </Link>
          <p className="text-muted-foreground">สร้างบัญชี Admin</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              สมัครบัญชี Admin
            </CardTitle>
            <CardDescription>
              กรอกข้อมูลเพื่อสร้างบัญชีผู้ดูแลระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">อีเมล</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
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
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">ยืนยันรหัสผ่าน</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </Field>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      กำลังสมัคร...
                    </>
                  ) : (
                    'สมัครบัญชี'
                  )}
                </Button>
              </FieldGroup>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/admin" className="text-primary hover:underline">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
