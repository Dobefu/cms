import { render, screen, waitFor } from '@testing-library/react'
import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Content from './page'

const cookieStore = await cookies()

describe('content', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () =>
        Promise.resolve({
          data: {
            token: '',
            content: [{ id: 1, title: 'Content' }],
          },
        }),
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()

    cookieStore.delete('session')
  })

  it('renders normally', async () => {
    expect.hasAssertions()

    render(<Content />)

    await waitFor(() => {
      expect(screen.getByText('There is no content yet')).toBeDefined()
    })

    expect(screen).toBeDefined()
  })

  it('can delete content', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    render(<Content />)

    expect(screen.getByText('Loading...')).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeDefined()
    })
  })
})
