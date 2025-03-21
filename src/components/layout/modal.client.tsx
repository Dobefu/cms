'use client'

import iconClose from '@iconify/icons-mdi/close'
import { Icon } from '@iconify/react/dist/iconify.js'
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
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={closeModal}
      />

      <dialog
        className="start-1/2 top-1/2 z-50 -translate-1/2 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900"
        onClose={closeModal}
        ref={dialogRef}
      >
        <div className="-m-6 mb-0 p-2">
          <button className="btn ms-auto rounded-full p-2" onClick={closeModal}>
            <Icon className="size-4" icon={iconClose} ssr />
          </button>
        </div>

        {children}
      </dialog>
    </>,
    document.getElementById('modal-root')!,
  )
}
