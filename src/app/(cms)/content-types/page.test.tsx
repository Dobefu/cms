import { render, screen, waitFor } from '@testing-library/react'
import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ContentTypes from './page'

const cookieStore = await cookies()

describe('content-types', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () =>
        Promise.resolve({
          data: {
            token: '',
            content_types: [{ id: 1, title: 'Content type' }],
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

    render(<ContentTypes />)

    await waitFor(() => {
      expect(screen.getByText('There are no content types yet')).toBeDefined()
    })

    expect(screen).toBeDefined()
  })

  it('renders can delete a content type', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    render(<ContentTypes />)

    expect(screen.getByText('Loading...')).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeDefined()
    })
  })
})
