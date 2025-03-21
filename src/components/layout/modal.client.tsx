'use client'

import { useRouter } from 'next/navigation'
import { type ComponentRef, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export type Props = Readonly<{
  children: React.ReactNode
}>

export default function Modal({ children }: Props) {
  const router = useRouter()
  const dialogRef = useRef<ComponentRef<'dialog'>>(null)

  useEffect(() => {
    /* v8 ignore start */
    if (!dialogRef.current?.open) {
      dialogRef.current?.show()
    }
    /* v8 ignore stop */
  }, [])

  const closeModal = useCallback(() => {
    /* v8 ignore start */
    router.back()
    /* v8 ignore stop */
  }, [router])

  return createPortal(
    <>
      <div
        aria-hidden
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={closeModal}
      />

      <dialog
        className="start-1/2 top-1/2 z-50 w-full max-w-xl -translate-1/2 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900"
        onClose={closeModal}
        ref={dialogRef}
      >
        {children}
      </dialog>
    </>,
    document.getElementById('modal-root')!,
  )
}
