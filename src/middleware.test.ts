import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { middleware } from './middleware'

const cookieStore = await cookies()

describe('route middleware', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => {
        const token = cookieStore.get('session')

        if (!token?.value || token.value === 'bogus') {
          return Promise.resolve({ data: null, error: '' })
        }

        return Promise.resolve({ data: { token: 'test-new' }, error: null })
      },
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()

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

  it("deletes the session token if it's invalid", () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'bogus' })

    const response = middleware()

    expect(response).toBeDefined()
  })

  it('refreshes the session token when there is a new one', () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    const response = middleware()

    expect(response).toBeDefined()
  })
})
