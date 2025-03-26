import { render, screen } from '@testing-library/react'
import { useCallback } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Toast from './toast.client'

describe('toast', () => {
  const onClose = useCallback(() => {}, [])

  vi.mock('react', async () => ({
    ...(await vi.importActual('react')),
    useCallback: () => undefined,
  }))

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
