import { ModalContext } from '@/components/layout/modal.client'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

export function useModal() {
  const router = useRouter()
  const context = useContext(ModalContext)

  if (!context) {
    return {
      /* v8 ignore start */
      closeModal: (onClose?: () => void) => {
        if (onClose) {
          onClose()
        } else {
          router.back()
        }
      },
      /* v8 ignore start */
    }
  }

  return context
}
