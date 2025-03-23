import { useContext } from 'react'
import { ToastContext } from '../components/toast/toast-context.client'

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return {
    ...context,
    success: (message: string, duration?: number) =>
      context.showToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      context.showToast(message, 'error', duration),
    info: (message: string, duration?: number) =>
      context.showToast(message, 'info', duration),
    warning: (message: string, duration?: number) =>
      context.showToast(message, 'warning', duration),
  }
}
