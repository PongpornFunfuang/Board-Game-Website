import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Facebook, MessageCircle, MapPin, Clock, ExternalLink } from 'lucide-react'
import type { StoreInfo } from '@/lib/types'

async function getStoreInfo() {
  const supabase = await createClient()
  const { data } = await supabase.from('store_info').select('*').limit(1).single()
  return data as StoreInfo | null
}

export default async function ContactPage() {
  const store = await getStoreInfo()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-8 lg:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">ติดต่อเรา</h1>
            <p className="text-muted-foreground">สนใจบอร์ดเกมหรือมีคำถาม? ติดต่อเราได้เลย!</p>
          </div>
        </section>

        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
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
                    <p className="text-2xl font-bold mb-4">{store?.phone || '092 614 2919'}</p>
                    <a href={`tel:${store?.phone || '092 614 2919'}`}>
                      <Button className="w-full gap-2">
                        <Phone className="h-4 w-4" />
                        โทรเลย
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Facebook */}
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
                    {store?.facebook ? (
                      <a href={store.facebook} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full gap-2">
                          <ExternalLink className="h-4 w-4" />
                          เปิด Facebook
                        </Button>
                      </a>
                    ) : (
                      <Button className="w-full gap-2" disabled>
                        <Facebook className="h-4 w-4" />
                        ยังไม่มีข้อมูล
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Line */}
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
                    <p className="text-2xl font-bold mb-4">{store?.line_id || '@ntercafe'}</p>
                    <a href={`tel:${store?.line_id || '@ntercafe'}`}>
                      <Button className="w-full gap-2">
                        <MessageCircle className="h-4 w-4" />
                        เพิ่มเพื่อนใน Line
                      </Button>
                    </a>  
                  </CardContent>
                </Card>

                {/* Google Maps */}
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

              {/* Store Hours */}
              <div className="flex justify-center w-full"> {/* ตัวหุ้มชั้นนอกสุดเพื่อบีบให้ Card อยู่กลางหน้า */}
                <Card className="mt-6 text-center w-full max-w-md"> {/* ใส่ max-w-md เพื่อจำกัดความกว้างของกรอบ */}
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
                    <div className="p-4 rounded-lg bg-muted w-full max-w-[280px]"> {/* บีบขนาดกล่องสีเทาด้านในด้วย */}
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
