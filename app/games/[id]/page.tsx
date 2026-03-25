import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Users, Clock, MessageCircle, Phone, Facebook } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { BoardGame, StoreInfo } from '@/lib/types'

async function getGameData(id: string) {
  const supabase = await createClient()

  const [gameRes, storeRes] = await Promise.all([
    supabase.from('board_games').select('*, category:categories(*)').eq('id', id).single(),
    supabase.from('store_info').select('*').limit(1).single()
  ])

  return {
    game: gameRes.data as BoardGame | null,
    store: storeRes.data as StoreInfo | null
  }
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { game, store } = await getGameData(id)

  if (!game) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link href="/games">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้าบอร์ดเกม
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
              {game.image_url ? (
                <Image
                  src={game.image_url}
                  alt={game.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6">
              <div>
                {game.category && (
                  <Badge className="mb-3">{game.category.name}</Badge>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold">{game.name}</h1>
              </div>

              <div className="flex flex-wrap gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">จำนวนผู้เล่น</p>
                      <p className="font-semibold">{game.min_players}-{game.max_players} คน</p>
                    </div>
                  </CardContent>
                </Card>
                {game.play_time && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">เวลาเล่น</p>
                        <p className="font-semibold">{game.play_time}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">รายละเอียด</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {game.description || 'ไม่มีรายละเอียดสำหรับเกมนี้'}
                </p>
              </div>

              {/* Contact Section */}
              <div className="mt-auto pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">สนใจเกมนี้? ติดต่อเราได้เลย!</h2>
                <div className="flex flex-wrap gap-3">
                  {store?.phone && (
                    <a href={`tel:${store.phone}`}>
                      <Button variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        {store.phone}
                      </Button>
                    </a>
                  )}
                  {store?.line_id && (
                    <Button variant="outline" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Line: {store.line_id}
                    </Button>
                  )}
                  {store?.facebook && (
                    <a href={store.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Button>
                    </a>
                  )}
                </div>
                <Button size="lg" className="w-full mt-4">
                  สอบถามเลย
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
