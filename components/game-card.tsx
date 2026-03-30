/**
 * ไฟล์: Board-Game-Website/components/game-card.tsx
 * หน้าที่: แสดงผลการ์ดบอร์ดเกมแต่ละรายการ (Game Thumbnail)
 * การทำงาน: รับข้อมูล Object ของเกมมาแสดงผล พร้อมเอฟเฟกต์ Hover และ Responsive
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Clock } from 'lucide-react' // ไอคอนจำนวนผู้เล่น และเวลา
import type { BoardGame } from '@/lib/types'

// กำหนด Props ว่าคอมโพเนนต์นี้ต้องการข้อมูลบอร์ดเกม 1 ชุด
interface GameCardProps {
  game: BoardGame
}

export function GameCard({ game }: GameCardProps) {
  return (
    // ตัวการ์ดหลัก: มีการใส่ group เพื่อใช้ทำเอฟเฟกต์กับลูกข้างใน และ transition เมื่อเอาเมาส์มาวาง (hover)
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      
      {/* --- [SECTION: GAME IMAGE] --- */}
      {/* กำหนดสัดส่วนภาพเป็น 4:3 (aspect-[4/3]) และป้องกันภาพล้นออกนอกขอบ */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {game.image_url ? (
          <Image
            src={game.image_url}
            alt={game.name}
            fill // ให้รูปขยายเต็มพื้นที่ของ div พ่อ
            // เอฟเฟกต์ group-hover:scale-105 จะทำให้ภาพซูมเข้าเล็กน้อยเมื่อวางเมาส์บนการ์ด
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // กรณีไม่มีรูปภาพ ให้แสดงข้อความ No Image กลางกรอบ
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {/* ป้ายหมวดหมู่ (Category Badge): วางซ้อนทับบนมุมขวาของรูปภาพ */}
        {game.category && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            {game.category.name}
          </Badge>
        )}
      </div>

      {/* --- [SECTION: GAME INFO] --- */}
      <CardContent className="p-4">
        {/* ชื่อเกม: ใช้ truncate เพื่อตัดข้อความเป็น ... ถ้าชื่อยาวเกินบรรทัดเดียว */}
        <h3 className="font-semibold text-lg truncate">{game.name}</h3>
        
        {/* รายละเอียด: ใช้ line-clamp-2 เพื่อแสดงผลเพียง 2 บรรทัดแรกเท่านั้น */}
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {game.description || 'ไม่มีรายละเอียด'}
        </p>

        {/* Stats: ข้อมูลจำนวนผู้เล่นและเวลาที่ใช้เล่น */}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          {/* จำนวนผู้เล่น */}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{game.min_players}-{game.max_players} คน</span>
          </div>
          
          {/* เวลาที่ใช้เล่น (แสดงผลเฉพาะเมื่อมีข้อมูล) */}
          {game.play_time && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{game.play_time}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* --- [SECTION: ACTION BUTTON] --- */}
      <CardFooter className="p-4 pt-0">
        {/* ลิงก์ไปยังหน้ารายละเอียดของเกมตาม ID */}
        <Link href={`/games/${game.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            ดูรายละเอียด
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}