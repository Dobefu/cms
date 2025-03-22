import { ModalContext } from '@/components/layout/modal.client'
import { useContext } from 'react'

export function useModal() {
  const context = useContext(ModalContext)

  if (!context) {
    return {
      closeModal: (onClose?: () => void) => {
        if (onClose) onClose()
      },
    }
  }

  return context
}
