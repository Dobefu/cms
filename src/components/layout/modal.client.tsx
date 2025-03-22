'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import {
  type ComponentRef,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

type ModalContext = {
  closeModal: (onClose?: () => void) => void
}

export const ModalContext = createContext<ModalContext | null>(null)

export type Props = Readonly<{
  children: React.ReactNode
}>

export default function Modal({ children }: Props) {
  const router = useRouter()
  const dialogRef = useRef<ComponentRef<'dialog'>>(null)
  const [isOpen, setIsOpen] = useState(true)
  const onCloseRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.show()
    }
  }, [])

  const closeModal = useCallback((onClose?: () => void) => {
    onCloseRef.current = onClose
    setIsOpen(false)
  }, [])

  const handleClose = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleExitComplete = useCallback(() => {
    const callback = onCloseRef.current
    onCloseRef.current = undefined

    /* v8 ignore start */
    if (callback) {
      callback()
    } else {
      router.back()
    }
    /* v8 ignore stop */
  }, [router])

  return createPortal(
    <ModalContext.Provider value={{ closeModal }}>
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {isOpen ? (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              data-testid="modal-backdrop"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={handleClose}
            />

            <motion.dialog
              animate={{ opacity: 1, translateY: 0 }}
              className="start-1/2 top-1/2 z-50 w-full max-w-xl -translate-1/2 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900"
              exit={{ opacity: 0, translateY: -16 }}
              initial={{ opacity: 0, translateY: -16 }}
              onClose={handleClose}
              ref={dialogRef}
            >
              {children}
            </motion.dialog>
          </>
        ) : null}
      </AnimatePresence>
    </ModalContext.Provider>,
    document.getElementById('modal-root')!,
  )
}
