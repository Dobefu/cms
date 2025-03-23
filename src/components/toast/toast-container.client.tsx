'use client'

import { AnimatePresence } from 'motion/react'
import { useToast } from '../../hooks/use-toast'
import Toast from './toast.client'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} onClose={removeToast} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
