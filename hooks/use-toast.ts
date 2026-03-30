/**
 * ไฟล์: Board-Game-Website/hooks/use-toast.ts
 * หน้าที่: ระบบจัดการสถานะของ Toast (State Management)
 * การทำงาน: ใช้แนวคิดแบบ Reducer ในการจัดการคิวการแสดงผลแจ้งเตือน
 */

'use client'

import * as React from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

// --- [CONFIGURATIONS] ---
const TOAST_LIMIT = 1 // จำนวน Toast สูงสุดที่จะแสดงพร้อมกันบนหน้าจอ
const TOAST_REMOVE_DELAY = 1000000 // ระยะเวลาก่อนจะลบ Toast ออกจาก Memory (ตั้งไว้สูงเพื่อให้ Animation ปิดทำงานทัน)

// --- [TYPES & INTERFACES] ---
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// ชุดคำสั่ง (Action Types) สำหรับใช้งานใน Reducer
const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',       // เพิ่มแจ้งเตือนใหม่
  UPDATE_TOAST: 'UPDATE_TOAST', // อัปเดตข้อมูลแจ้งเตือนเดิม
  DISMISS_TOAST: 'DISMISS_TOAST', // สั่งให้เริ่มปิดการแสดงผล (เริ่มเล่น Animation ปิด)
  REMOVE_TOAST: 'REMOVE_TOAST',   // ลบข้อมูลออกจาก State ถาวร
} as const

let count = 0

/**
 * genId: ฟังก์ชันสร้าง ID แบบสุ่มให้แต่ละ Toast เพื่อไม่ให้ซ้ำกัน
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

interface State {
  toasts: ToasterToast[]
}

// เก็บรายชื่อ Timeout เพื่อเอาไว้ล้างค่าเมื่อ Toast ถูกลบ
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * addToRemoveQueue: เตรียมลบ Toast ออกจากสถานะเมื่อถึงเวลาที่กำหนด
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: 'REMOVE_TOAST', toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * reducer: หัวใจหลักในการเปลี่ยนสถานะ (State) ตาม Action ที่ได้รับ
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        // เพิ่มอันใหม่ไปข้างหน้า และตัดให้เหลือจำนวนเท่าที่ TOAST_LIMIT กำหนด
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action
      // เมื่อสั่ง Dismiss จะส่ง Toast เข้าคิวเตรียมลบ (Remove)
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id))
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false } // เปลี่ยน open เป็น false เพื่อเริ่มปิด UI
            : t
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) return { ...state, toasts: [] }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// --- [GLOBAL LOGIC] ---
// เก็บรายชื่อ Listener (ฟังก์ชันอัปเดตสถานะ) ของทุก Component ที่เรียกใช้ useToast
const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] } // ตัวแปรเก็บสถานะไว้ในหน่วยความจำนอก Component

/**
 * dispatch: ส่ง Action ไปให้ Reducer ทำงาน และแจ้งเตือนทุกลูกค้า (Listeners) ให้เปลี่ยนค่าตาม
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

/**
 * toast(): ฟังก์ชันสำหรับเรียกใช้งานแจ้งเตือนจากที่ไหนก็ได้ในแอป
 */
function toast({ ...props }: Omit<ToasterToast, 'id'>) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => { if (!open) dismiss() },
    },
  })

  return { id, dismiss, update }
}

/**
 * useToast: Hook หลักที่จะเรียกใช้ภายใน Component ของ React
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState) // เพิ่มตัวเองเข้าไปในรายชื่อผู้รับข้อมูลอัปเดต
    return () => {
      // ลบตัวเองออกจากรายชื่อเมื่อ Component ถูกทำลาย (Unmount)
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }