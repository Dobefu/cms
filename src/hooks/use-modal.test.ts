import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useModal } from './use-modal'

describe('useModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a fallback context when no ModalContext is provided', () => {
    expect.hasAssertions()

    const context = useModal()

    expect(context.closeModal).toBeDefined()
  })
})
