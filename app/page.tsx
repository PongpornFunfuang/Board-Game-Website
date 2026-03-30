/**
 * ไฟล์: Board-Game-Website/app/page.tsx
 * หน้าที่: หน้าแรกของเว็บไซต์ (Landing Page) ทำหน้าที่รวบรวมข้อมูลจากฐานข้อมูลมาสรุปแสดงผล
 * รูปแบบการทำงาน: Server Component (ดึงข้อมูลจากฝั่ง Server ก่อนส่งไปให้ผู้ใช้)
 */

// --- [SECTION: IMPORT] นำเข้าเครื่องมือและส่วนประกอบ ---
import { createClient } from '@/lib/supabase/server' // สร้างการเชื่อมต่อกับ Supabase Database
import { Header } from '@/components/header'       // ส่วนเมนูด้านบน
import { Footer } from '@/components/footer'       // ส่วนข้อมูลด้านล่างสุด
import { GameCard } from '@/components/game-card'   // คอมโพเนนต์แสดงผลการ์ดเกม (Reusable UI)
import { Button } from '@/components/ui/button'     // ปุ่ม UI สำเร็จรูปจากระบบ
import { Card, CardContent } from '@/components/ui/card' // กรอบ (Card) สำหรับจัดกลุ่มเนื้อหา
// นำเข้าไอคอนจาก Lucide React
import { Dice5, Users, Clock, Sparkles, ArrowRight, Phone, Facebook, MessageCircle, MapPin } from 'lucide-react'
import Link from 'next/link' // ใช้สำหรับสร้าง Link ภายในเว็บ (ทำให้กดแล้วเปลี่ยนหน้าทันทีไม่ต้องโหลดใหม่)
import type { BoardGame, Category, StoreInfo } from '@/lib/types' // นำเข้าโครงสร้างข้อมูล (Type Definition)

/**
 * ฟังก์ชัน getHomeData: หัวใจการดึงข้อมูล
 * เชื่อมต่อไปยัง: Supabase Database
 */
async function getHomeData() {
  const supabase = await createClient() // สร้างตัว Client เพื่อคุยกับ Database

  // Promise.all: สั่งให้ดึงข้อมูล 3 ตารางพร้อมกันเพื่อความรวดเร็ว (Parallel Fetching)
  const [gamesRes, categoriesRes, storeRes] = await Promise.all([
    // 1. ตาราง board_games: ดึงมา 6 เกมล่าสุด พร้อม Join ตาราง categories เพื่อเอาชื่อหมวดหมู่มาด้วย
    supabase.from('board_games').select('*, category:categories(*)').limit(6).order('created_at', { ascending: false }),
    // 2. ตาราง categories: ดึงหมวดหมู่ทั้งหมดมาเรียงตามตัวอักษร A-Z
    supabase.from('categories').select('*').order('name'),
    // 3. ตาราง store_info: ดึงข้อมูลร้านค้า (เช่น ชื่อร้าน, เบอร์โทร) มาเพียง 1 รายการ
    supabase.from('store_info').select('*').limit(1).single()
  ])

  return {
    games: (gamesRes.data || []) as BoardGame[],
    categories: (categoriesRes.data || []) as Category[],
    store: storeRes.data as StoreInfo | null
  }
}

/**
 * HomePage Component: ส่วนแสดงผลหลัก
 */
export default async function HomePage() {
  // รับข้อมูลที่ได้จากการ Query Database ด้านบนมาเตรียมใช้งาน
  const { games, categories, store } = await getHomeData()

  return (
    // min-h-screen: สูงอย่างน้อยเท่าหน้าจอ | flex-col: เรียงลูกจากบนลงล่าง
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* flex-1: ให้ส่วนเนื้อหายืดตัวกินพื้นที่ว่างทั้งหมด เพื่อดัน Footer ไปอยู่ล่างสุดเสมอ */}
      <main className="flex-1">

        {/* --- 1. [Hero Section] ส่วนหัวทักทาย --- 
            className: py-20 (Padding บน-ล่าง 80px), bg-gradient-to-br (ไล่สีเฉดเฉียงลงขวา)
            bg-gradient-to-br: พื้นหลังไล่เฉดสีจากบนซ้ายไปล่างขวา
            primary/10: ใช้สีหลักแบบโปร่งแสง 10% สร้างมิติ
        */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 lg:py-32">
          {/* container: จำกัดความกว้างเนื้อหาให้อยู่กลางจอ | mx-auto: จัดกึ่งกลางแนวนอน | px-4: กันเนื้อหาชนขอบมือถือ */}
          <div className="container mx-auto px-4">
            {/* max-w-3xl: จำกัดความกว้างกลุ่มข้อความให้อ่านง่าย | text-center: จัดตัวอักษรให้อยู่กึ่งกลาง */}
            <div className="max-w-3xl mx-auto text-center">
              {/* flex justify-center: จัดไอคอนให้อยู่กลางแนวนอน | mb-6: ระยะห่างด้านล่างไอคอน */}
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10"> {/* rounded-full: ทำขอบมนเป็นวงกลม */}
                  <img src="/LOGO.jpg" alt="Dice5 Logo"
                    className="h-50 w-50 text-primary rounded-full " />{/* h-16 w-16: กำหนดขนาดไอคอน 64px */}
                </div>
              </div>

              {/* text-4xl lg:text-6xl: ตัวอักษรใหญ่มาก (ขยายตามขนาดหน้าจอ) | tracking-tight: ตัวอักษรชิดกันดูทันสมัย | text-balance: จัดการตัดคำให้สมดุล */}
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                {store?.name || 'NTER Board Game Cafe'}
              </h1>

              {/* mt-4: ระยะห่างด้านบน | text-xl: ขนาดตัวอักษร | text-muted-foreground: สีเทาจางลง | text-pretty: จัดการตัดคำย่อหน้าให้สวยงาม */}
              <p className="mt-4 text-xl text-muted-foreground text-pretty">
                {store?.slogan || 'สวรรค์ของคนรักบอร์ดเกม'}
              </p>

              {/* mt-8: ระยะห่างด้านบน | flex-col sm:flex-row: มือถือเรียงแนวตั้ง/คอมเรียงแนวนอน | gap-4: ระยะห่างระหว่างปุ่ม */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/games">
                  {/* w-full sm:w-auto: มือถือปุ่มเต็มหน้าจอ/คอมปุ่มตามเนื้อหา | gap-2: ระยะห่างข้อความกับไอคอนข้างในปุ่ม */}
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

        {/* --- 2. [Features Section] ส่วนบอกจุดเด่น --- 
            grid-cols-1 md:grid-cols-3: มือถือโชว์ 1 แถวเดี่ยว | คอมพิวเตอร์โชว์ 3 คอลัมน์
            py-16: ระยะห่างบน-ล่าง | bg-muted/30: พื้นหลังสีเทาอ่อนจางๆ เพื่อแยกส่วนเนื้อหา
        */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* การ์ดที่ 1: เกมคุณภาพ */}
              <Card>
                <CardContent className="p-6 text-center"> {/* p-6: ระยะห่างภายในการ์ด | text-center: จัดกลางตัวอักษร */}
                  {/* mx-auto: วางวงกลมกึ่งกลาง | items-center justify-center: จัดไอคอนให้อยู่กลางวงกลม */}
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">เกมคุณภาพ</h3>
                  <p className="text-sm text-muted-foreground">คัดสรรเกมคุณภาพจากทั่วโลก</p>
                </CardContent>
              </Card>

              {/* การ์ดที่ 2: เล่นได้ทุกกลุ่ม */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">เล่นได้ทุกกลุ่ม</h3>
                  <p className="text-sm text-muted-foreground">เหมาะสำหรับเพื่อนฝูงและครอบครัว</p>
                </CardContent>
              </Card>

              {/* การ์ดที่ 3: สนุกได้ทุกเวลา */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">สนุกได้ทุกเวลา</h3>
                  <p className="text-sm text-muted-foreground">เปิดบริการทุกวัน พร้อมคำแนะนำจากพนักงาน</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- 3. [Categories Section] ส่วนเลือกตามหมวดหมู่ --- 
            เชื่อมต่อไปยัง: /games?category=[ID] (เพื่อไปหน้ากรองเกมตามประเภท)
        */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* items-center justify-between: จัดหัวข้อไว้ซ้ายสุดและปุ่มไว้ขวาสุดในแถวเดียวกัน */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold">หมวดหมู่</h2>
              <Link href="/categories">
                <Button variant="ghost" className="gap-2">ดูทั้งหมด <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            {/* grid-cols-2 md:grid-cols-4: แบ่งช่องหมวดหมู่ 2-4 ช่องตามขนาดหน้าจอ | gap-4: ระยะห่างระหว่างการ์ดหมวดหมู่ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/games?category=${category.id}`}>
                  {/* hover:shadow-md: เมื่อเอาเมาส์จี้ให้มีเงา | transition-shadow: ให้เงานุ่มนวล | h-full: ให้การ์ดสูงเท่ากันแม้ข้อความสั้นยาวไม่เท่ากัน */}
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold">{category.name}</h3>
                      {/* line-clamp-2: ถ้าคำอธิบายยาวเกิน 2 บรรทัด ให้ตัดท้ายเป็น ... | mt-1: ห่างจากชื่อเล็กน้อย */}
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

        {/* --- 4. [Featured Games] ส่วนแสดงเกมล่าสุด --- 
            ดึงข้อมูลเกม 6 เกมจาก Database มาวนลูปแสดงผล
        */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold">บอร์ดเกมล่าสุด</h2>
            </div>
            {/* grid-cols-1 sm:grid-cols-2 lg:grid-cols-3: จัดระเบียบการ์ดเกมตามหน้าจอ (1 -> 2 -> 3 คอลัมน์) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* วนลูป (map) ข้อมูลเกมส่งไปที่ GameCard component */}
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>

        {/* --- 5. [Contact Section] ส่วนช่องทางการติดต่อ --- 
            เชื่อมต่อไปยัง: URL ภายนอก เช่น Facebook, Google Maps
        */}
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
                          <p className="font-medium">NTER Board Game Cafe</p>
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
                {/* ตัวอย่างการปรับในส่วนของ Google Maps */}
                {store?.google_maps_url && (
                  <a href={store.google_maps_url} target="_blank" rel="noopener noreferrer" className="block h-full"> {/* เพิ่ม block h-full */}
                    <Card className="hover:shadow-md transition-shadow h-full"> {/* เพิ่ม h-full */}
                      <CardContent className="p-4 flex items-center gap-3 h-full"> {/* เพิ่ม h-full */}
                        <MapPin className="h-5 w-5 text-primary shrink-0" /> {/* เพิ่ม shrink-0 กันไอคอนเบี้ยว */}
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