'use client'

import { cn } from '@/utils/cn'
import iconCheck from '@iconify/icons-mdi/check-circle'
import iconClose from '@iconify/icons-mdi/close'
import iconError from '@iconify/icons-mdi/close-circle'
import iconInfo from '@iconify/icons-mdi/information'
import iconWarning from '@iconify/icons-mdi/warning-circle'
import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { useCallback } from 'react'
import { type Toast as ToastType } from './toast-context.client'

type Props = Readonly<{
  toast: ToastType
  onClose: (id: string) => void
}>

const icons = {
  success: iconCheck,
  error: iconError,
  info: iconInfo,
  warning: iconWarning,
}

const colors = {
  success: 'bg-green-500 dark:bg-green-600',
  error: 'bg-red-500 dark:bg-red-600',
  info: 'bg-zinc-500 dark:bg-zinc-950',
  warning: 'bg-amber-500 dark:bg-amber-600',
}

export default function Toast({ toast, onClose }: Props) {
  /* v8 ignore start */
  const handleClose = useCallback(() => {
    onClose(toast.id)
  }, [onClose, toast.id])
  /* v8 ignore stop */

  return (
    <motion.div
      animate={{ opacity: 1, translateX: 0 }}
      className={cn(
        'flex items-center gap-2 rounded-lg px-6 py-4 font-medium text-white shadow-sm',
        colors[toast.type],
      )}
      exit={{ opacity: 0, translateX: 100 }}
      initial={{ opacity: 0, translateX: 100 }}
    >
      <Icon className="size-5" icon={icons[toast.type]} ssr />

      <p className="flex-1">{toast.message}</p>

      <button
        className="ml-2 cursor-pointer rounded-full p-1 hover:bg-white/10"
        onClick={handleClose}
      >
        <Icon className="size-4" icon={iconClose} ssr />
      </button>
    </motion.div>
  )
}
