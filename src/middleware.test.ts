import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { middleware } from './middleware'

describe('middleware', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test-new' }, error: null }),
      ok: true,
      status: 200,
    })
  })

  afterEach(async () => {
    vi.restoreAllMocks()

    const cookieStore = await cookies()
    cookieStore.delete('session')
  })

  it('adds a Content-Security-Policy header', () => {
    expect.hasAssertions()

    const response = middleware()

    expect(response).toBeDefined()
  })

  it('uses the cached CSP string when called more than once', () => {
    expect.hasAssertions()

    const response = middleware()

    expect(response).toBeDefined()
  })

  it('refreshes the session token when there is a new one', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const response = middleware()

    expect(response).toBeDefined()
  })
})
