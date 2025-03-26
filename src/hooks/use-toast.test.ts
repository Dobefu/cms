import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from './use-toast'

let shouldHaveContext: boolean

describe('useToast', () => {
  beforeEach(() => {
    shouldHaveContext = false
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  vi.mock('react', async () => ({
    ...(await vi.importActual('react')),
    useContext: () => {
      if (!shouldHaveContext) return

      return {
        showToast: (message: string) => {
          throw new Error(message)
        },
      }
    },
  }))

  it('returns fallback context when no ToastContext is provided', () => {
    expect.hasAssertions()

    expect(() => useToast()).toThrow(
      'useToast must be used within a ToastProvider',
    )
  })

  it('returns the context', () => {
    expect.hasAssertions()

    shouldHaveContext = true

    const context = useToast()

    expect(() => context.success('success toast')).toThrow('success toast')
    expect(() => context.error('error toast')).toThrow('error toast')
    expect(() => context.info('info toast')).toThrow('info toast')
    expect(() => context.warning('warning toast')).toThrow('warning toast')

    expect(context).toBeDefined()
  })
})
