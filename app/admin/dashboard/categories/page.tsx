/**
 * ไฟล์: Board-Game-Website/app/admin/dashboard/categories/page.tsx
 * หน้าที่: หน้าจัดการหมวดหมู่ของบอร์ดเกม (เพิ่ม, แก้ไข, ลบ)
 * การทำงาน: ติดต่อกับ API Route (/api/categories) เพื่อจัดการข้อมูลใน Database
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import type { Category } from '@/lib/types' // ใช้ Type Category จากที่นิยามไว้

export default function AdminCategoriesPage() {
  // --- [STATE MANAGEMENT] ---
  const [categories, setCategories] = useState<Category[]>([]) // รายการหมวดหมู่ทั้งหมด
  const [loading, setLoading] = useState(true)                // สถานะการโหลดข้อมูล
  const [dialogOpen, setDialogOpen] = useState(false)        // ควบคุม Modal เพิ่ม/แก้ไข
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // ควบคุม Modal ยืนยันการลบ
  const [saving, setSaving] = useState(false)                 // สถานะระหว่างส่งข้อมูลไป API
  
  // เก็บข้อมูลหมวดหมู่ที่กำลังจัดการ (แก้ไขหรือลบ)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  
  // ข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  /**
   * fetchCategories: ดึงข้อมูลหมวดหมู่ทั้งหมดจาก API
   */
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // เรียกข้อมูลครั้งแรกเมื่อหน้าจอโหลดเสร็จ
  useEffect(() => {
    fetchCategories()
  }, [])

  /**
   * openAddDialog: รีเซ็ตฟอร์มเพื่อเตรียมเพิ่มหมวดหมู่ใหม่
   */
  const openAddDialog = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
    setDialogOpen(true)
  }

  /**
   * openEditDialog: นำข้อมูลหมวดหมู่ที่เลือกมาใส่ฟอร์มเพื่อแก้ไข
   */
  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setDialogOpen(true)
  }

  /**
   * handleSave: บันทึกข้อมูล (POST ถ้าเพิ่มใหม่, PUT ถ้าแก้ไข)
   */
  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingCategory) {
        // กรณีแก้ไข (Update)
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        // กรณีเพิ่มใหม่ (Create)
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      setDialogOpen(false) // ปิด Modal
      fetchCategories()    // รีโหลดตาราง
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setSaving(false)
    }
  }

  /**
   * handleDelete: ลบหมวดหมู่ที่เลือก
   */
  const handleDelete = async () => {
    if (!categoryToDelete) return

    setSaving(true)
    try {
      await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: 'DELETE'
      })
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* ส่วนหัวของหน้าจอ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">จัดการหมวดหมู่</h1>
          <p className="text-muted-foreground mt-1">เพิ่ม แก้ไข และลบหมวดหมู่</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          เพิ่มหมวดหมู่ใหม่
        </Button>
      </div>

      {/* --- [SECTION: CATEGORIES TABLE] --- */}
      <Card>
        <CardHeader>
          <CardTitle>รายการหมวดหมู่ ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              ไม่พบหมวดหมู่
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อหมวดหมู่</TableHead>
                    <TableHead>รายละเอียด</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      {/* ใช้ truncate เพื่อไม่ให้รายละเอียดที่ยาวเกินไปทำตารางเสียรูป */}
                      <TableCell className="max-w-md truncate">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* ปุ่มแก้ไข */}
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {/* ปุ่มลบ */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCategoryToDelete(category)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- [DIALOG: ADD/EDIT] --- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลหมวดหมู่ให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">ชื่อหมวดหมู่ *</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ชื่อหมวดหมู่"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">รายละเอียด</FieldLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="รายละเอียดหมวดหมู่"
                rows={3}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              ยกเลิก
            </Button>
            {/* ปิดการใช้งานปุ่มถ้ากำลังบันทึก หรือยังไม่ได้กรอกชื่อหมวดหมู่ */}
            <Button onClick={handleSave} disabled={saving || !formData.name}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                'บันทึก'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- [DIALOG: DELETE CONFIRMATION] --- */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบหมวดหมู่ "{categoryToDelete?.name}" ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังลบ...
                </>
              ) : (
                'ลบ'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}