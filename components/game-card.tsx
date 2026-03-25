'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Clock } from 'lucide-react'
import type { BoardGame } from '@/lib/types'

interface GameCardProps {
  game: BoardGame
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {game.image_url ? (
          <Image
            src={game.image_url}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {game.category && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            {game.category.name}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{game.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {game.description || 'ไม่มีรายละเอียด'}
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{game.min_players}-{game.max_players} คน</span>
          </div>
          {game.play_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{game.play_time}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/games/${game.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            ดูรายละเอียด
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
