/**
 * ไฟล์: Board-Game-Website/app/games/[id]/page.tsx
 * หน้าที่: หน้าแสดงรายละเอียดบอร์ดเกมรายเกม (Dynamic Route)
 * หลักการ: รับ ID จาก URL -> ดึงข้อมูลจาก Supabase -> แสดงผลแบบ Server Component
 */

// --- [SECTION: IMPORT] นำเข้าเครื่องมือและ UI Components ---
import { createClient } from '@/lib/supabase/server' // ฟังก์ชันสร้างการเชื่อมต่อกับ Supabase (Server-side)
import { Header } from '@/components/header'          // ส่วนหัวเว็บไซต์
import { Footer } from '@/components/footer'          // ส่วนท้ายเว็บไซต์
import { Button } from '@/components/ui/button'        // คอมโพเนนต์ปุ่มสำเร็จรูป
import { Badge } from '@/components/ui/badge'          // ป้ายกำกับเล็กๆ (เช่น ใช้บอกหมวดหมู่)
import { Card, CardContent } from '@/components/ui/card' // คอมโพเนนต์กรอบ (Card)
// นำเข้าไอคอนจาก Lucide React เพื่อใช้สื่อความหมาย
import { ArrowLeft, Users, Clock, MessageCircle, Phone, Facebook } from 'lucide-react'
import Image from 'next/image'      // คอมโพเนนต์จัดการรูปภาพประสิทธิภาพสูงของ Next.js
import Link from 'next/link'       // สำหรับทำ Client-side Navigation (เปลี่ยนหน้าโดยไม่โหลดใหม่)
import { notFound } from 'next/navigation' // ฟังก์ชันเรียกหน้า 404 เมื่อหาข้อมูลไม่พบ
import type { BoardGame, StoreInfo } from '@/lib/types' // นำเข้า Type ของข้อมูล

/**
 * ฟังก์ชัน getGameData: ดึงข้อมูลจากฐานข้อมูล
 * @param id : ไอดีของเกมที่รับมาจาก URL
 */
async function getGameData(id: string) {
  const supabase = await createClient() // เริ่มต้นเชื่อมต่อ Database

  // ดึงข้อมูล 2 อย่างพร้อมกันเพื่อลดเวลาการรอ (Parallel Fetching)
  const [gameRes, storeRes] = await Promise.all([
    // 1. ดึงเกมที่ไอดีตรงกัน พร้อมดึงข้อมูลหมวดหมู่ (Join categories) มาด้วย
    supabase.from('board_games').select('*, category:categories(*)').eq('id', id).single(),
    // 2. ดึงข้อมูลร้านค้า (เอามาแค่แถวเดียว) เพื่อใช้แสดงเบอร์โทร/โซเชียล
    supabase.from('store_info').select('*').limit(1).single()
  ])

  return {
    game: gameRes.data as BoardGame | null,
    store: storeRes.data as StoreInfo | null
  }
}

/**
 * GameDetailPage: คอมโพเนนต์หน้าหลัก
 * params: ตัวแปรที่ Next.js ส่งมาให้ (ในที่นี้คือค่า id จากชื่อโฟลเดอร์ [id])
 */
export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. รอรับค่า ID จากพารามิเตอร์ของ URL
  const { id } = await params
  
  // 2. นำ ID ไปดึงข้อมูลจาก Database
  const { game, store } = await getGameData(id)

  // 3. ถ้าไม่มีข้อมูลเกมนี้ (เช่น พิมพ์ ID มั่วใน URL) ให้แสดงหน้า 404 ทันที
  if (!game) {
    notFound()
  }

  return (
    // min-h-screen: สูงอย่างน้อยเท่าหน้าจอ | flex-col: จัด Layout หลักแบบบนลงล่าง
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* flex-1: ให้เนื้อหายืดพื้นที่ที่เหลือเพื่อดัน Footer ลงไปข้างล่างสุด */}
      <main className="flex-1">
        {/* container mx-auto: จัดกึ่งกลางหน้าจอ | px-4: กันขอบจอ | py-8: ห่างบน-ล่าง 32px */}
        <div className="container mx-auto px-4 py-8">
          
          {/* ส่วนปุ่มย้อนกลับ */}
          <Link href="/games">
            {/* variant="ghost": ปุ่มแบบใสไม่มีเส้นขอบ | mb-6: ห่างจากเนื้อหาด้านล่าง | gap-2: ระยะห่างไอคอนกับตัวหนังสือ */}
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้าบอร์ดเกม
            </Button>
          </Link>

          {/* Grid Layout: grid-cols-1 (มือถือแถวเดียว) | lg:grid-cols-2 (คอมพิวเตอร์แบ่ง 2 ฝั่งซ้าย-ขวา) | gap-8: ระยะห่างระหว่าง 2 ฝั่ง */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- ฝั่งซ้าย: รูปภาพเกม --- */}
            {/* aspect-square: บังคับกรอบเป็นสี่เหลี่ยมจัตุรัส | relative: จำเป็นสำหรับ Image fill | rounded-lg: ขอบมน | overflow-hidden: ตัดรูปที่เกินขอบมนออก */}
            <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
              {game.image_url ? (
                <Image
                  src={game.image_url} // URL รูปภาพจาก Database
                  alt={game.name}      // ข้อความอธิบายรูป (สำคัญต่อ SEO และ Accessibility)
                  fill                // ให้รูปยืดเต็มกรอบ parent
                  className="object-cover" // ปรับรูปให้พอดีกรอบ (เหมือน background-size: cover)
                  priority            // สั่งให้โหลดรูปนี้เป็นอันดับแรก (เพราะเป็นจุดโฟกัสสายตา)
                />
              ) : (
                // กรณีไม่มีรูปภาพ ให้แสดงข้อความแทน
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            {/* --- ฝั่งขวา: ข้อมูลรายละเอียด --- */}
            {/* flex-col gap-6: จัดเรียงข้อมูลแนวตั้ง เว้นระยะแต่ละหัวข้อห่างกัน 24px */}
            <div className="flex flex-col gap-6">
              <div>
                {/* แสดง Badge ชื่อหมวดหมู่ (ถ้ามีข้อมูล) | mb-3: ห่างจากชื่อเกมข้างล่าง */}
                {game.category && (
                  <Badge className="mb-3">{game.category.name}</Badge>
                )}
                {/* ชื่อเกม: ตัวหนา ขนาดใหญ่ (3xl บนมือถือ / 4xl บนคอม) */}
                <h1 className="text-3xl lg:text-4xl font-bold">{game.name}</h1>
              </div>

              {/* ส่วนแสดงข้อมูลจำนวนผู้เล่นและเวลา (Stats) */}
              <div className="flex flex-wrap gap-4">
                <Card>
                  {/* p-4: Padding ด้านในกรอบ | flex items-center gap-3: จัดไอคอนและข้อความให้อยู่บรรทัดเดียวกัน */}
                  <CardContent className="p-4 flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" /> {/* ไอคอนผู้เล่น สีหลักของเว็บ */}
                    <div>
                      <p className="text-xs text-muted-foreground">จำนวนผู้เล่น</p>
                      <p className="font-semibold">{game.min_players}-{game.max_players} คน</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* แสดงเวลาเล่น (ถ้าใน Database มีข้อมูล) */}
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

              {/* ส่วนรายละเอียดเนื้อหาเกม */}
              <div>
                <h2 className="text-lg font-semibold mb-2">รายละเอียด</h2>
                {/* text-muted-foreground: สีเทาจาง | leading-relaxed: เว้นระยะบรรทัดให้อ่านง่ายขึ้น */}
                <p className="text-muted-foreground leading-relaxed">
                  {game.description || 'ไม่มีรายละเอียดสำหรับเกมนี้'}
                </p>
              </div>

              {/* --- ส่วนติดต่อสอบถาม (อยู่ล่างสุดของฝั่งขวา) --- */}
              {/* mt-auto: ดันส่วนนี้ลงไปล่างสุดเสมอ | pt-6: ระยะห่างข้างบนเส้นแบ่ง | border-t: ขีดเส้นแบ่งส่วน */}
              <div className="mt-auto pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">สนใจเกมนี้? ติดต่อเราได้เลย!</h2>
                
                {/* ส่วนปุ่มโซเชียล/โทรศัพท์: flex-wrap gap-3 (ถ้าที่เต็มจะขึ้นบรรทัดใหม่เอง) */}
                <div className="flex flex-wrap gap-3">
                  {/* ปุ่มโทรศัพท์ (ถ้ามีข้อมูลใน Database) */}
                  {store?.phone && (
                    <a href={`tel:${store.phone}`}>
                      <Button variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        {store.phone}
                      </Button>
                    </a>
                  )}
                  {/* ปุ่ม Line (แสดงแค่ ID) */}
                  {store?.line_id && (
                    <Button variant="outline" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Line: {store.line_id}
                    </Button>
                  )}
                  {/* ปุ่ม Facebook (เปิดหน้าต่างใหม่) */}
                  {store?.facebook && (
                    <a href={store.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Button>
                    </a>
                  )}
                </div>
                
                {/* ปุ่มเรียกความสนใจ (Call to Action) หลักด้านล่างสุด */}
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