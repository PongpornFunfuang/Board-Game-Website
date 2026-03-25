'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { BoardGame, Category } from '@/lib/types'

export default function AdminGamesPage() {
  const [games, setGames] = useState<BoardGame[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingGame, setEditingGame] = useState<BoardGame | null>(null)
  const [gameToDelete, setGameToDelete] = useState<BoardGame | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    category_id: '',
    min_players: 2,
    max_players: 4,
    play_time: ''
  })

  const fetchGames = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/games?${params.toString()}`)
      const data = await res.json()
      setGames(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const handleSearch = () => {
    fetchGames()
  }

  const openAddDialog = () => {
    setEditingGame(null)
    setFormData({
      name: '',
      description: '',
      image_url: '',
      category_id: '',
      min_players: 2,
      max_players: 4,
      play_time: ''
    })
    setDialogOpen(true)
  }

  const openEditDialog = (game: BoardGame) => {
    setEditingGame(game)
    setFormData({
      name: game.name,
      description: game.description || '',
      image_url: game.image_url || '',
      category_id: game.category_id || '',
      min_players: game.min_players,
      max_players: game.max_players,
      play_time: game.play_time || ''
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...formData,
        category_id: formData.category_id || null
      }

      if (editingGame) {
        await fetch(`/api/games/${editingGame.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      setDialogOpen(false)
      fetchGames()
    } catch (error) {
      console.error('Error saving game:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!gameToDelete) return

    setSaving(true)
    try {
      await fetch(`/api/games/${gameToDelete.id}`, {
        method: 'DELETE'
      })
      setDeleteDialogOpen(false)
      setGameToDelete(null)
      fetchGames()
    } catch (error) {
      console.error('Error deleting game:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">จัดการบอร์ดเกม</h1>
          <p className="text-muted-foreground mt-1">เพิ่ม แก้ไข และลบบอร์ดเกม</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          เพิ่มเกมใหม่
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาบอร์ดเกม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>ค้นหา</Button>
          </div>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการบอร์ดเกม ({games.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              ไม่พบบอร์ดเกม
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">รูป</TableHead>
                    <TableHead>ชื่อเกม</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead>จำนวนผู้เล่น</TableHead>
                    <TableHead>เวลาเล่น</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>
                        <div className="w-12 h-12 relative rounded overflow-hidden bg-muted">
                          {game.image_url ? (
                            <Image
                              src={game.image_url}
                              alt={game.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              N/A
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell>{game.category?.name || '-'}</TableCell>
                      <TableCell>{game.min_players}-{game.max_players} คน</TableCell>
                      <TableCell>{game.play_time || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(game)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setGameToDelete(game)
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGame ? 'แก้ไขบอร์ดเกม' : 'เพิ่มบอร์ดเกมใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลบอร์ดเกมให้ครบถ้วน
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">ชื่อเกม *</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ชื่อบอร์ดเกม"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">รายละเอียด</FieldLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="รายละเอียดเกม"
                rows={3}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="image_url">URL รูปภาพ</FieldLabel>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="category">หมวดหมู่</FieldLabel>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="min_players">ผู้เล่นขั้นต่ำ</FieldLabel>
                <Input
                  id="min_players"
                  type="number"
                  min={1}
                  value={formData.min_players}
                  onChange={(e) => setFormData({ ...formData, min_players: parseInt(e.target.value) || 1 })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="max_players">ผู้เล่นสูงสุด</FieldLabel>
                <Input
                  id="max_players"
                  type="number"
                  min={1}
                  value={formData.max_players}
                  onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) || 1 })}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="play_time">เวลาเล่น</FieldLabel>
              <Input
                id="play_time"
                value={formData.play_time}
                onChange={(e) => setFormData({ ...formData, play_time: e.target.value })}
                placeholder="30-60 นาที"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              ยกเลิก
            </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบเกม "{gameToDelete?.name}" ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้
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
