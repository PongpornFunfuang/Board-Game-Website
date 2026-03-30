/**
 * ไฟล์: Board-Game-Website/lib/utils.ts
 * หน้าที่: ฟังก์ชันช่วยจัดการคลาสของ CSS (Tailwind CSS Class Management)
 * การทำงาน: รวมชื่อคลาสและแก้ไขปัญหาความซ้ำซ้อนของ Tailwind Class
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * ฟังก์ชัน cn (ย่อมาจาก Class Name)
 * @param inputs - รายชื่อคลาสต่างๆ ที่เราส่งเข้าไป (เป็น string, object, หรือ array ก็ได้)
 * @returns - ชุดชื่อคลาสที่ผ่านการทำความสะอาดและรวมกันเรียบร้อยแล้ว
 */
export function cn(...inputs: ClassValue[]) {
  // 1. clsx: ช่วยให้เราเขียนเงื่อนไขในคลาสได้ง่าย เช่น { 'bg-red-500': true, 'p-4': false }
  // 2. twMerge: ช่วยแก้ปัญหา "คลาสทับซ้อน" เช่น ถ้าเราส่ง 'p-4' และ 'p-8' เข้าไป 
  //    twMerge จะฉลาดพอที่จะเลือกใช้แค่ 'p-8' เพื่อไม่ให้เกิดการขัดแย้งของ CSS
  return twMerge(clsx(inputs))
}