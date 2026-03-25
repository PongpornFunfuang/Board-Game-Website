import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GameCard } from '@/components/game-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dice5, Users, Clock, Sparkles, ArrowRight, Phone, Facebook, MessageCircle, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { BoardGame, Category, StoreInfo } from '@/lib/types'

async function getHomeData() {
  const supabase = await createClient()

  const [gamesRes, categoriesRes, storeRes] = await Promise.all([
    supabase.from('board_games').select('*, category:categories(*)').limit(6).order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name'),
    supabase.from('store_info').select('*').limit(1).single()
  ])

  return {
    games: (gamesRes.data || []) as BoardGame[],
    categories: (categoriesRes.data || []) as Category[],
    store: storeRes.data as StoreInfo | null
  }
}

export default async function HomePage() {
  const { games, categories, store } = await getHomeData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <Dice5 className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                {store?.name || 'Board Game Paradise'}
              </h1>
              <p className="mt-4 text-xl text-muted-foreground text-pretty">
                {store?.slogan || 'สวรรค์ของคนรักบอร์ดเกม'}
              </p>
              <p className="mt-2 text-muted-foreground">
                มีบอร์ดเกมให้เลือกหลากหลายประเภท ทั้งเกมวางแผน เกมปาร์ตี้ เกมครอบครัว และอื่นๆ อีกมากมาย
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/games">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    ดูบอร์ดเกมทั้งหมด
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    ติดต่อเรา
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">เกมคุณภาพ</h3>
                  <p className="text-sm text-muted-foreground">
                    คัดสรรเกมคุณภาพจากทั่วโลก เล่นสนุกทุกเกม
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">เล่นได้ทุกกลุ่ม</h3>
                  <p className="text-sm text-muted-foreground">
                    มีเกมสำหรับทุกกลุ่ม ตั้งแต่ 2 คนไปจนถึงปาร์ตี้ใหญ่
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">ทุกระยะเวลา</h3>
                  <p className="text-sm text-muted-foreground">
                    ตั้งแต่เกมเร็ว 15 นาที ไปจนถึงเกมยาวหลายชั่วโมง
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold">หมวดหมู่</h2>
                <p className="text-muted-foreground mt-1">เลือกชมเกมตามประเภทที่ชอบ</p>
              </div>
              <Link href="/categories">
                <Button variant="ghost" className="gap-2">
                  ดูทั้งหมด
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/games?category=${category.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {category.description || 'ดูเกมในหมวดหมู่นี้'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Games */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold">บอร์ดเกมล่าสุด</h2>
                <p className="text-muted-foreground mt-1">เกมใหม่ที่เพิ่งเข้าร้าน</p>
              </div>
              <Link href="/games">
                <Button variant="ghost" className="gap-2">
                  ดูทั้งหมด
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">ติดต่อเรา</h2>
              <p className="text-muted-foreground mb-8">
                สนใจบอร์ดเกมตัวไหน สอบถามได้เลย!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {store?.phone && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">โทรศัพท์</p>
                        <p className="font-medium">{store.phone}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {store?.facebook && (
                  <a href={store.facebook} target="_blank" rel="noopener noreferrer">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Facebook className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">Facebook</p>
                          <p className="font-medium">Board Game Paradise</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                )}
                {store?.line_id && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Line</p>
                        <p className="font-medium">{store.line_id}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {store?.google_maps_url && (
                  <a href={store.google_maps_url} target="_blank" rel="noopener noreferrer">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground">Google Maps</p>
                          <p className="font-medium">ดูแผนที่</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
