'use client'

import Link from 'next/link'
import { Dice5, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Dice5 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">NTER Board Game Cafe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            หน้าแรก
          </Link>
          <Link href="/games" className="text-sm font-medium hover:text-primary transition-colors">
            บอร์ดเกมทั้งหมด
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            หมวดหมู่
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            ติดต่อเรา
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              หน้าแรก
            </Link>
            <Link
              href="/games"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              บอร์ดเกมทั้งหมด
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              หมวดหมู่
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ติดต่อเรา
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
