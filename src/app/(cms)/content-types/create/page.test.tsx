import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CreateContentType from './page'

describe('content-types/create', () => {
  vi.mock('react', async () => ({
    ...(await vi.importActual('react')),
    useContext: () => ({
      showToast: (message: string) => {
        throw new Error(message)
      },
    }),
  }))

  it('renders normally', () => {
    expect.hasAssertions()

    render(<CreateContentType />)

    expect(screen).toBeDefined()
  })
})
