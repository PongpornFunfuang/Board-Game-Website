'use client'

// ✅ กัน prerender พัง (สำคัญมาก)
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

// 🔹 Component หลัก (ใช้ useSearchParams ต้องอยู่ข้างใน)
function GamesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryParam = searchParams.get('category')

  const [games, setGames] = useState<BoardGame[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)

  // ✅ fetch games
  const fetchGames = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (selectedCategory) params.set('category', selectedCategory)

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

  // ✅ fetch categories
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

  // โหลด categories ครั้งแรก
  useEffect(() => {
    fetchCategories()
  }, [])

  // โหลด games ทุกครั้งที่ filter เปลี่ยน
  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  // sync URL → state
  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  // เลือก category
  const handleCategorySelect = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }

    router.push(`/games?${params.toString()}`)
  }

  // search
  const handleSearch = () => {
    fetchGames()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* HERO */}
        <section className="py-8 lg:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              บอร์ดเกมทั้งหมด
            </h1>
            <p className="text-muted-foreground">
              ค้นหาและเลือกชมบอร์ดเกมที่คุณสนใจ
            </p>
          </div>
        </section>

        {/* FILTER */}
        <section className="py-8">
          <div className="container mx-auto px-4">

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

            {/* LOADING */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  ไม่พบบอร์ดเกมที่ค้นหา
                </p>
              </div>
            ) : (
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

// 🔹 Export หลัก (ครอบ Suspense)
export default function GamesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <GamesContent />
    </Suspense>
  )
}