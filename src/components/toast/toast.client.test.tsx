import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useCallback } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Toast from './toast.client'

describe('toast', () => {
  const onClose = useCallback(() => {}, [])

  vi.mock('react', async () => {
    const actual = await vi.importActual('react')

    return {
      ...actual,
      useCallback: () => undefined,
    }
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(
      <Toast
        onClose={onClose}
        toast={{ id: '', message: '', type: 'success' }}
      />,
    )

    expect(screen).toBeDefined()
  })
})
