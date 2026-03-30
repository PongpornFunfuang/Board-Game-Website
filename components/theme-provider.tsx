/**
 * ไฟล์: Board-Game-Website/components/theme-provider.tsx
 * หน้าที่: Wrapper Component สำหรับจัดการระบบ Theme (Light/Dark Mode) ของทั้ง Application
 * การทำงาน: ทำหน้าที่ส่งต่อค่าธีม (Context) ไปยังทุก Component ที่อยู่ภายใต้ children
 */

'use client' // ต้องเป็น Client Component เพราะมีการใช้ Context และเข้าถึง LocalStorage ของ Browser

import * as React from 'react'
// นำเข้า ThemeProvider จาก library 'next-themes' 
// ซึ่งเป็นตัวจัดการการสลับโหมด และป้องกันปัญหา Flash of Unstyled Content (Fouc)
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

/**
 * ThemeProvider Component
 * @param children - Component ทั้งหมดของ App ที่จะถูกห่อหุ้ม (ปกติคือใน layout.tsx)
 * @param props - คุณสมบัติต่างๆ เช่น defaultTheme, attribute, enableSystem เป็นต้น
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // ส่งต่อ props ทั้งหมดไปยัง NextThemesProvider เพื่อให้ระบบ Theme เริ่มทำงาน
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}