/**
 * ไฟล์: Board-Game-Website/hooks/use-mobile.ts
 * หน้าที่: ตรวจสอบขนาดหน้าจอว่าอยู่ในระดับ Mobile หรือไม่ (Viewport Detection)
 * การทำงาน: ใช้ Window MatchMedia API เพื่อติดตามการเปลี่ยนแปลงขนาดหน้าจอแบบ Real-time
 */

import * as React from 'react'

// กำหนดจุดตัด (Breakpoint) ที่ 768px (มาตรฐานสำหรับ Tablet/Mobile)
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // สร้าง State เก็บค่า boolean: true = มือถือ, false = ไม่ใช่มือถือ
  // เริ่มต้นเป็น undefined เพื่อป้องกันปัญหา Hydration Mismatch ระหว่าง Server และ Client
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // 1. สร้าง Media Query List สำหรับตรวจสอบความกว้างหน้าจอที่น้อยกว่า 768px
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // 2. ฟังก์ชันที่จะทำงานเมื่อขนาดหน้าจอเปลี่ยนไปจนถึงจุด Breakpoint
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // 3. เริ่มต้นดักฟังเหตุการณ์ (Event Listener) การเปลี่ยนขนาดหน้าจอ
    mql.addEventListener('change', onChange)
    
    // 4. ตั้งค่าเริ่มต้นทันทีที่ Component โหลดเสร็จ (Initial Check)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // 5. Cleanup Function: ลบ Event Listener ออกเมื่อไม่ได้ใช้ Hook นี้แล้ว
    // เพื่อป้องกัน Memory Leak และประสิทธิภาพของ Browser
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // ส่งค่าออกไปเป็น boolean (ใช้ !! เพื่อบังคับให้เป็นค่า true/false เสมอ)
  return !!isMobile
}