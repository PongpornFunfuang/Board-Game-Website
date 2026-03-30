/**
 * ไฟล์: Board-Game-Website/app/categories/page.tsx
 * หน้าที่: หน้าแสดงรายการหมวดหมู่บอร์ดเกมทั้งหมด
 * รูปแบบการทำงาน: Server Component (ดึงข้อมูลหมวดหมู่มาสร้างรายการ Link เพื่อไปหน้าคลังเกม)
 */

import { createClient } from '@/lib/supabase/server' // ฟังก์ชันสร้างการเชื่อมต่อกับฐานข้อมูล Supabase
import { Header } from '@/components/header'          // คอมโพเนนต์ส่วนหัว
import { Footer } from '@/components/footer'          // คอมโพเนนต์ส่วนท้าย
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card' // UI Card
import { Button } from '@/components/ui/button'        // UI Button
// นำเข้าไอคอนจาก Lucide React เพื่อใช้แสดงตามชื่อหมวดหมู่
import { ArrowRight, Gamepad2, PartyPopper, Home, CreditCard } from 'lucide-react'
import Link from 'next/link'       // คอมโพเนนต์สำหรับการนำทาง (Navigation)
import type { Category } from '@/lib/types' // นำเข้า Type Definition ของ Category

/**
 * categoryIcons: การจับคู่ชื่อหมวดหมู่กับไอคอน
 * หน้าที่: ใช้สำหรับแสดงไอคอนที่สอดคล้องกับชื่อหมวดหมู่ในฐานข้อมูล
 */
const categoryIcons: Record<string, React.ReactNode> = {
  'เกมวางแผน': <Gamepad2 className="h-8 w-8" />,
  'เกมปาร์ตี้': <PartyPopper className="h-8 w-8" />,
  'เกมครอบครัว': <Home className="h-8 w-8" />,
  'เกมการ์ด': <CreditCard className="h-8 w-8" />,
}

/**
 * getCategories: ฟังก์ชันดึงข้อมูลหมวดหมู่จาก Database
 * .order('name') : สั่งให้เรียงลำดับตามตัวอักษรของชื่อหมวดหมู่
 */
async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return (data || []) as Category[]
}

export default async function CategoriesPage() {
  // 1. ดึงรายการหมวดหมู่ทั้งหมด
  const categories = await getCategories()

  return (
    // min-h-screen: สูงเต็มหน้าจอ | flex-col: เรียง Header-Main-Footer แนวตั้ง
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        
        {/* --- [SECTION 1: HERO / TITLE] --- 
            bg-muted/30: สีพื้นหลังเทาอ่อนเบาๆ เพื่อแยกส่วนหัว
        */}
        <section className="py-8 lg:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">หมวดหมู่บอร์ดเกม</h1>
            <p className="text-muted-foreground">เลือกชมบอร์ดเกมตามประเภทที่คุณสนใจ</p>
          </div>
        </section>

        {/* --- [SECTION 2: CATEGORY GRID] --- */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            
            {/* Grid Layout: grid-cols-1 (มือถือแถวเดียว) | md:grid-cols-2 (แท็บเล็ต/คอม 2 คอลัมน์) | gap-6: เว้นระยะห่าง */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* วนลูปแสดง Card ตามรายการหมวดหมู่ที่ดึงมาได้ */}
              {categories.map((category) => (
                // เชื่อมต่อไปยังหน้า /games พร้อมส่ง query string เป็น id ของหมวดหมู่นั้นๆ
                <Link key={category.id} href={`/games?category=${category.id}`}>
                  {/* h-full: สูงเท่ากันทุก Card | hover:shadow-lg: เพิ่มเงาเมื่อเอาเม้าส์ชี้ | transition-shadow: ให้เงาค่อยๆ ปรากฏ | group: ตั้งกลุ่มเพื่อสั่งงานลูกๆ เมื่อ hover */}
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        
                        {/* ส่วนแสดงไอคอนหมวดหมู่: bg-primary/10 (สีหลักจางๆ) */}
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          {/* ถ้าชื่อหมวดหมู่ไม่ตรงกับที่ตั้งไว้ใน categoryIcons ให้ใช้ Gamepad2 เป็นค่าเริ่มต้น */}
                          {categoryIcons[category.name] || <Gamepad2 className="h-8 w-8" />}
                        </div>

                        {/* ข้อความชื่อและรายละเอียดหมวดหมู่ */}
                        <div className="flex-1">
                          <CardTitle className="text-xl">{category.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {category.description || 'คลิกเพื่อดูเกมในหมวดหมู่นี้'}
                          </CardDescription>
                        </div>

                        {/* ไอคอนลูกศรขวา: group-hover:text-primary (เปลี่ยนสีเมื่อเม้าส์ชี้ที่ Card) */}
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>

                    {/* ส่วนปุ่มใน Card */}
                    <CardContent>
                      <Button variant="outline" className="w-full gap-2">
                        ดูบอร์ดเกมในหมวดหมู่นี้
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}