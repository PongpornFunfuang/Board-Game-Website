import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Next.js 15 ต้อง await params
    const supabase = await createClient()
    const body = await request.json()

    // แก้ไข: ใช้ id ตรงๆ (string/uuid) ไม่ต้องครอบ Number()
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: body.name,
        description: body.description,
        updated_at: new Date().toISOString(), // อัปเดตเวลาแก้ไข
      })
      .eq('id', id) 
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // แก้ไข: ใช้ id ตรงๆ เพื่อลบข้อมูลตาม UUID
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}