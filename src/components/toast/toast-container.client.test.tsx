import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ToastContainer from './toast-container.client'

describe('toastContainer', () => {
  vi.mock('react', async () => {
    const actual = await vi.importActual('react')

    return {
      ...actual,
      useContext: () => ({
        toasts: [
          {
            id: '',
            message: '',
            type: 'info',
          },
        ],
      }),
    }
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<ToastContainer />)

    expect(screen).toBeDefined()
  })
})
