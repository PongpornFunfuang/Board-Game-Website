import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Gamepad2, PartyPopper, Home, CreditCard } from 'lucide-react'
import Link from 'next/link'
import type { Category } from '@/lib/types'

const categoryIcons: Record<string, React.ReactNode> = {
  'เกมวางแผน': <Gamepad2 className="h-8 w-8" />,
  'เกมปาร์ตี้': <PartyPopper className="h-8 w-8" />,
  'เกมครอบครัว': <Home className="h-8 w-8" />,
  'เกมการ์ด': <CreditCard className="h-8 w-8" />,
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return (data || []) as Category[]
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-8 lg:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">หมวดหมู่บอร์ดเกม</h1>
            <p className="text-muted-foreground">เลือกชมบอร์ดเกมตามประเภทที่คุณสนใจ</p>
          </div>
        </section>

        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={`/games?category=${category.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          {categoryIcons[category.name] || <Gamepad2 className="h-8 w-8" />}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{category.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {category.description || 'คลิกเพื่อดูเกมในหมวดหมู่นี้'}
                          </CardDescription>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
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
