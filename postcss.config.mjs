/** * ไฟล์: Board-Game-Website/postcss.config.mjs
 * หน้าที่: กำหนดค่าการทำงานของ PostCSS (CSS Processor)
 * การทำงาน: ทำหน้าที่เป็นตัวกลางในการแปลง (Compile) โค้ด Tailwind CSS v4 ให้เป็น CSS ปกติ
 */

/** @type {import('postcss-load-config').Config} */
// กำหนดรูปแบบตัวแปร config ให้ตรงตามมาตรฐานของ PostCSS Load Config เพื่อให้ Editor ช่วยตรวจสอบความถูกต้องได้
const config = {
  // plugins: รายชื่อเครื่องมือเสริมที่จะให้ PostCSS ใช้งาน
  plugins: {
    // '@tailwindcss/postcss': เป็นปลั๊กอินหลักของ Tailwind CSS v4 
    // ทำหน้าที่สแกนไฟล์ HTML/React ของคุณ แล้วสร้าง CSS เฉพาะตัวที่คุณใช้งานจริงออกมา
    '@tailwindcss/postcss': {},
  },
}

// ส่งออกค่า config เพื่อให้ระบบ Build (เช่น Next.js) นำไปใช้งานตอนรันโปรแกรม
export default config