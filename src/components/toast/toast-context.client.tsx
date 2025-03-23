'use client'

import { createContext, useCallback, useMemo, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type Toast = {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type ToastContextType = {
  toasts: Toast[]
  showToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)

export default function ToastProvider({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [toasts, setToasts] = useState<Toast[]>([])

  /* v8 ignore start */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])
  /* v8 ignore stop */

  /* v8 ignore start */
  const showToast = useCallback(
    (message: string, type: ToastType, duration = 5000) => {
      const id = crypto.randomUUID()
      const newToast = { id, message, type, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast],
  )
  /* v8 ignore stop */

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
