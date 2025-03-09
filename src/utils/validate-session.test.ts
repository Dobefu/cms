import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { validateSession } from './validate-session'

describe('validateSession', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: false,
      status: 422,
    })
  })

  afterEach(async () => {
    process.env.API_ENDPOINT = 'http://api-endpoint'
    vi.restoreAllMocks()

    const cookieStore = await cookies()
    cookieStore.delete('session')
  })

  it('returns early when the API endpoint is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_ENDPOINT

    const response = await validateSession()

    expect(response).toStrictEqual({ isAnonymous: true })
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const response = await validateSession()

    expect(response).toStrictEqual({ isAnonymous: true })
  })

  it('returns early when a failed response has an error object', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: 'test error' }),
      ok: false,
      status: 422,
    })

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const response = await validateSession()

    expect(response).toStrictEqual({ isAnonymous: true })
  })

  it('returns early when the token cannot be found in the response', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: null }),
      ok: true,
      status: 200,
    })

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const response = await validateSession()

    expect(response).toStrictEqual({ isAnonymous: true })
  })

  it('returns a response when successful', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test' }, error: null }),
      ok: true,
      status: 200,
    })

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const response = await validateSession()

    expect(response).toStrictEqual({ isAnonymous: false, token: 'test' })
  })
})
