import { render } from '@testing-library/react'
import { cookies } from 'next/headers'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContentTypes from './page'

const cookieStore = await cookies()

describe('content-types', () => {
  afterEach(() => {
    vi.restoreAllMocks()

    cookieStore.delete('session')
  })

  it('renders normally', async () => {
    expect.hasAssertions()

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

    cookieStore.set({ name: 'session', value: 'test' })

    render(await ContentTypes())

    expect(screen).toBeDefined()
  })

  it('renders without content types', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: false,
      status: 500,
    })

    render(await ContentTypes())

    expect(screen).toBeDefined()
  })
})
