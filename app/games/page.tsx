/**
 * ไฟล์: Board-Game-Website/app/games/page.tsx
 * หน้าที่: หน้าคลังเกมทั้งหมด (Catalog Page) พร้อมระบบค้นหาและกรองประเภท
 * รูปแบบการทำงาน: Client Component (มีการใช้ State และ Interaction จากผู้ใช้)
 */

'use client'

// ✅ กัน prerender พัง (บังคับให้ Next.js ดึงข้อมูลสดใหม่เสมอ ไม่ใช้ Static)
export const dynamic = 'force-dynamic'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GameCard } from '@/components/game-card'
import { SearchBar } from '@/components/search-bar'
import { CategoryFilter } from '@/components/category-filter'
import { Skeleton } from '@/components/ui/skeleton'
import type { BoardGame, Category } from '@/lib/types'

// 🔹 [GamesContent Component] ส่วนเนื้อหาหลัก
function GamesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ดึงค่า category จาก URL (เช่น ?category=123)
  const categoryParam = searchParams.get('category')

  // --- [STATE: เก็บข้อมูลภายในหน้า] ---
  const [games, setGames] = useState<BoardGame[]>([]) // เก็บรายการเกม
  const [categories, setCategories] = useState<Category[]>([]) // เก็บหมวดหมู่ทั้งหมด
  const [loading, setLoading] = useState(true) // สถานะการโหลด
  const [searchQuery, setSearchQuery] = useState('') // ข้อความที่ใช้ค้นหา
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)

  /**
   * ✅ fetchGames: ฟังก์ชันดึงข้อมูลเกมตาม Filter
   * useCallback: ช่วยจำฟังก์ชันไว้ไม่ให้สร้างใหม่บ่อยๆ ถ้าตัวแปรที่เฝ้าดูไม่เปลี่ยน
   */
  const fetchGames = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (selectedCategory) params.set('category', selectedCategory)

      // ดึงข้อมูลผ่าน API Route ที่เราสร้างไว้
      const res = await fetch(`/api/games?${params.toString()}`, {
        cache: 'no-store',
      })

      const data = await res.json()
      setGames(data)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory])

  // ✅ fetchCategories: ดึงหมวดหมู่ทั้งหมดมาแสดงในแถบ Filter
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', {
        cache: 'no-store',
      })
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // โหลดหมวดหมู่ครั้งแรกที่เปิดหน้าเว็บ
  useEffect(() => {
    fetchCategories()
  }, [])

  // โหลดเกมใหม่ทุกครั้งที่ค่า fetchGames เปลี่ยน (เมื่อมีการ Search หรือเปลี่ยนหมวดหมู่)
  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  // ซิงค์ข้อมูลหมวดหมู่จาก URL มายัง State (กรณีผู้ใช้กด Back/Forward หรือกดจากหน้าอื่นมา)
  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  /**
   * handleCategorySelect: เมื่อกดเลือกหมวดหมู่
   * หน้าที่: อัปเดต URL เพื่อให้ Link ของหน้าเปลี่ยนตาม Filter
   */
  const handleCategorySelect = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }

    router.push(`/games?${params.toString()}`)
  }

  // handleSearch: เมื่อกดปุ่มค้นหาหรือกด Enter
  const handleSearch = () => {
    fetchGames()
  }

  return (
    // min-h-screen: สูงเต็มจอ | flex-col: เรียง Header-Main-Footer
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* --- 1. [Hero Section: หัวข้อหน้าคลังเกม] --- 
            py-8 lg:py-12: ระยะห่างบนล่าง (ขยายตามขนาดหน้าจอ)
            bg-muted/30: พื้นหลังสีเทาอ่อนจางๆ เพื่อเน้นส่วนหัวให้ชัดเจน
        */}
        <section className="py-8 lg:py-12 bg-muted/30">
          {/* container mx-auto px-4: จัดกึ่งกลางหน้าจอและเว้นระยะขอบจอ */}
          <div className="container mx-auto px-4">
            {/* text-3xl lg:text-4xl: ขนาดหัวข้อใหญ่ขึ้นเมื่อดูบนคอม | font-bold: ตัวหนา | mb-2: ห่างจากคำบรรยายด้านล่าง */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              บอร์ดเกมทั้งหมด
            </h1>
            <p className="text-muted-foreground">
              ค้นหาและเลือกชมบอร์ดเกมที่คุณสนใจ
            </p>
          </div>
        </section>

        {/* --- 2. [Filter & Game List Section] --- */}
        <section className="py-8">
          <div className="container mx-auto px-4">

            {/* ส่วน Search และ Category:
                flex-col lg:flex-row: มือถือเรียงแนวตั้ง จอคอมเรียงแนวนอน
                lg:items-center: จอใหญ่จัดให้ไอเทมอยู่กลางแนวตั้ง
                lg:justify-between: ดัน Search ไปซ้าย ดัน Filter ไปขวา
                mb-8: ระยะห่างด้านล่างก่อนถึงรายการเกม
            */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />

              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
              />
            </div>

            {/* --- 3. [Display Logic: ส่วนแสดงผลตามสถานะ] --- */}
            
            {/* สถานะกำลังโหลด (Loading) แสดงเป็นโครงร่างเทาๆ (Skeleton) */}
            {loading ? (
              // grid-cols-1 -> xl:grid-cols-4: ปรับจำนวนคอลัมน์ตามความกว้างหน้าจอ (1 ถึง 4 คอลัมน์)
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] w-full" /> {/* โครงภาพเกม */}
                    <Skeleton className="h-6 w-3/4" />           {/* โครงชื่อเกม */}
                    <Skeleton className="h-4 w-full" />            {/* โครงคำอธิบาย */}
                    <Skeleton className="h-10 w-full" />           {/* โครงปุ่ม */}
                  </div>
                ))}
              </div>
            ) : games.length === 0 ? (
              /* สถานะไม่พบข้อมูล (Empty State) */
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  ไม่พบบอร์ดเกมที่ค้นหา
                </p>
              </div>
            ) : (
              /* สถานะแสดงรายการเกม (Success State) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}

          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

/**
 * 🔹 GamesPage (Export หลัก)
 * หน้าที่: ครอบ GamesContent ด้วย Suspense เพื่อจัดการช่วงเวลาที่รอโหลดข้อมูลจาก URL
 */
export default function GamesPage() {
  return (
    // fallback: แสดงคำว่า Loading... ระหว่างรอการประมวลผล client-side
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <GamesContent />
    </Suspense>
  )
}