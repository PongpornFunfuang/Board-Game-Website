/**
 * ไฟล์: Board-Game-Website/app/contact/page.tsx
 * หน้าที่: หน้าแสดงข้อมูลการติดต่อร้าน (Contact Us)
 * รูปแบบการทำงาน: Server Component (Fetch ข้อมูลจาก Database แล้ว Render จากฝั่ง Server ทันที)
 */

import { createClient } from '@/lib/supabase/server' // ฟังก์ชันสร้างตัวเชื่อมต่อ Supabase ฝั่ง Server
import { Header } from '@/components/header'          // ส่วนหัวเว็บไซต์
import { Footer } from '@/components/footer'          // ส่วนท้ายเว็บไซต์
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card' // ส่วนประกอบของกรอบข้อมูล (Card)
import { Button } from '@/components/ui/button'        // ส่วนประกอบปุ่ม
// นำเข้าไอคอนสื่อความหมายจาก Lucide React
import { Phone, Facebook, MessageCircle, MapPin, Clock, ExternalLink } from 'lucide-react'
import type { StoreInfo } from '@/lib/types'           // นำเข้า Type สำหรับข้อมูลร้านค้า

/**
 * getStoreInfo: ฟังก์ชันดึงข้อมูลรายละเอียดร้านค้าจาก Database
 * ดึงข้อมูลจากตาราง 'store_info' มาเพียง 1 แถว (Single)
 */
async function getStoreInfo() {
  const supabase = await createClient() // เริ่มต้นการเชื่อมต่อ
  // .limit(1).single() หมายถึงเอามาแค่แถวเดียวเท่านั้น
  const { data } = await supabase.from('store_info').select('*').limit(1).single()
  return data as StoreInfo | null
}

export default async function ContactPage() {
  // 1. เรียกใช้ฟังก์ชันดึงข้อมูลร้านค้ามาเก็บไว้ในตัวแปร store
  const store = await getStoreInfo()

  return (
    // min-h-screen: สูงอย่างน้อยเท่าหน้าจอ | flex-col: จัดวางแนวตั้ง (Header -> Main -> Footer)
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* flex-1: ให้เนื้อหาหลักยืดเต็มพื้นที่ที่เหลือ เพื่อดัน Footer ลงไปข้างล่าง */}
      <main className="flex-1">
        
        {/* --- [SECTION 1: HERO / TITLE] --- 
            py-8 lg:py-12: ระยะห่างบนล่าง (ขยายตามขนาดหน้าจอ)
            bg-muted/30: พื้นหลังสีเทาอ่อนจางๆ (30% opacity) เพื่อแยกสัดส่วนหัวข้อ
        */}
        <section className="py-8 lg:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            {/* text-3xl -> 4xl: ขนาดหัวข้อที่ใหญ่ขึ้นตามหน้าจอ | font-bold: ตัวหนา | mb-2: ห่างจากบรรทัดล่าง */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">ติดต่อเรา</h1>
            <p className="text-muted-foreground">สนใจบอร์ดเกมหรือมีคำถาม? ติดต่อเราได้เลย!</p>
          </div>
        </section>

        {/* --- [SECTION 2: CONTACT CARDS GRID] --- */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            {/* max-w-4xl mx-auto: บีบเนื้อหาให้กว้างไม่เกิน 896px และจัดให้อยู่กลางหน้าจอ */}
            <div className="max-w-4xl mx-auto">
              
              {/* Grid: 1 คอลัมน์บนมือถือ | md:grid-cols-2: 2 คอลัมน์บนจอแท็บเล็ต/คอมพิวเตอร์ | gap-6: ระยะห่างระหว่าง Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* --- 1. การติดต่อผ่านโทรศัพท์ --- */}
                <Card>
                  <CardHeader>
                    {/* flex items-center: จัดไอคอนและหัวข้อให้อยู่บรรทัดเดียวกันกลางแนวตั้ง */}
                    <div className="flex items-center gap-4">
                      {/* ไอคอนพร้อมพื้นหลังวงกลมมน: bg-primary/10 (สีหลักโปร่งแสง) */}
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>โทรศัพท์</CardTitle>
                        <CardDescription>โทรหาเราได้เลย</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* แสดงเบอร์โทร ถ้าใน DB ไม่มีให้แสดงเบอร์ Default แทน */}
                    <p className="text-2xl font-bold mb-4">{store?.phone || '092 614 2919'}</p>
                    {/* ลิงก์ tel: สำหรับกดแล้วโทรออกทันทีบนมือถือ */}
                    <a href={`tel:${store?.phone || '092 614 2919'}`}>
                      <Button className="w-full gap-2">
                        <Phone className="h-4 w-4" />
                        โทรเลย
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* --- 2. การติดต่อผ่าน Facebook --- */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Facebook className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>Facebook</CardTitle>
                        <CardDescription>ติดตามข่าวสารของร้าน</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium mb-4">NTER Board Game Cafe</p>
                    {/* เช็คว่ามี URL Facebook ไหม ถ้ามีให้ทำปุ่มกดไปข้างนอก (External Link) */}
                    {store?.facebook ? (
                      <a href={store.facebook} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <ExternalLink className="h-4 w-4" />
                          เปิด Facebook
                        </Button>
                      </a>
                    ) : (
                      // ถ้าไม่มีข้อมูล ให้ปิดการใช้งานปุ่ม (Disabled)
                      <Button className="w-full gap-2" disabled>
                        <Facebook className="h-4 w-4" />
                        ยังไม่มีข้อมูล
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* --- 3. การติดต่อผ่าน Line --- */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>Line</CardTitle>
                        <CardDescription>แชทกับเราผ่าน Line</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* แสดง LINE ID | Fallback: @ntercafe */}
                    <p className="text-2xl font-bold mb-4">{store?.line_id || '@ntercafe'}</p>
                    <a href={`tel:${store?.line_id || '@ntercafe'}`}>
                      <Button className="w-full gap-2">
                        <MessageCircle className="h-4 w-4" />
                        เพิ่มเพื่อนใน Line
                      </Button>
                    </a>  
                  </CardContent>
                </Card>

                {/* --- 4. การติดต่อผ่านที่อยู่ (Google Maps) --- */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>ที่อยู่ร้าน</CardTitle>
                        <CardDescription>มาเยี่ยมชมร้านของเรา</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* text-sm: ตัวหนังสือเล็กหน่อย | leading-normal: ระยะห่างบรรทัดปกติ */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {store?.address || '42/16 ถ.อำมาตย์ ต.ในเมือง อ.เมือง จ.ขอนแก่น, Khon Kaen, Thailand'}
                    </p>
                    {store?.google_maps_url ? (
                      <a href={store.google_maps_url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <MapPin className="h-4 w-4" />
                          ดูแผนที่
                        </Button>
                      </a>
                    ) : (
                      <Button className="w-full gap-2" disabled>
                        <MapPin className="h-4 w-4" />
                        ยังไม่มีข้อมูลแผนที่
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* --- [SECTION 3: STORE HOURS - เวลาทำการ] --- */}
              {/* จัดกึ่งกลางชั้นนอกสุด */}
              <div className="flex justify-center w-full"> 
                {/* mt-6: ระยะห่างจาก Card ด้านบน | max-w-md: บีบความกว้าง Card เวลาให้เล็กลง (448px) | text-center: จัดกลางตัวอักษร */}
                <Card className="mt-6 text-center w-full max-w-md"> 
                  {/* flex-col items-center: จัด Icon และ Title ให้อยู่กลางแนวตั้ง */}
                  <CardHeader className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle>เวลาทำการ</CardTitle>
                      <CardDescription>เปิดให้บริการทุกวัน</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex justify-center">
                    {/* p-4: ระยะห่างด้านใน | bg-muted: พื้นหลังสีเทาอ่อนแยกส่วนเวลา | max-w-[280px]: จำกัดความกว้างกล่องสีเทา */}
                    <div className="p-4 rounded-lg bg-muted w-full max-w-[280px]">
                      <p className="font-medium">อังคาร - ศุกร์</p>
                      <p className="text-muted-foreground">12:00 - 24:00</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}