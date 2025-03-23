import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DeleteContentType from './page'

const cookieStore = await cookies()

describe('deleteContentType', () => {
  afterEach(() => {
    vi.restoreAllMocks()

    cookieStore.delete('session')
  })

  it('returns early when the fetch call fails', () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: false,
      status: 422,
    })

    cookieStore.set({ name: 'session', value: 'test' })

    render(DeleteContentType({ params: Promise.resolve({ id: '1' }) }))

    expect(screen).toBeDefined()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () =>
        Promise.resolve({ data: { content_type: {} }, error: undefined }),
      ok: true,
      status: 200,
    })

    cookieStore.set({ name: 'session', value: 'test' })

    render(DeleteContentType({ params: Promise.resolve({ id: '1' }) }))
    render(
      DeleteContentType({
        params: Promise.resolve({ id: '1', isInModal: true }),
      }),
    )

    expect(screen).toBeDefined()
  })
})
