import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

const cookieStore = await cookies()

describe('logout', () => {
  const oldApiEndpoint = process.env.API_ENDPOINT
  const oldApiKey = process.env.API_KEY

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: false,
      status: 422,
    })
  })

  afterEach(() => {
    process.env.API_ENDPOINT = oldApiEndpoint
    process.env.API_KEY = oldApiKey

    vi.restoreAllMocks()

    cookieStore.delete('session')
  })

  it('redirects early when the API endpoint is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_ENDPOINT

    await expect(GET()).rejects.toThrow('Mock redirect error')
  })

  it('redirects early when the API key is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_KEY

    await expect(GET()).rejects.toThrow('Mock redirect error')
  })

  it('redirects early when the session token is missing', async () => {
    expect.hasAssertions()

    await expect(GET()).rejects.toThrow('Mock redirect error')
  })

  it('redirects early when the fetch call fails', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    await expect(GET()).rejects.toThrow('Mock redirect error')
  })

  it('redirects when a failed response has an error object', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: 'test error' }),
      ok: false,
      status: 422,
    })

    cookieStore.set({ name: 'session', value: 'test' })

    await expect(GET()).rejects.toThrow('Mock redirect error')
  })

  it('redirects when successful', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test' }, error: null }),
      ok: true,
      status: 200,
    })

    cookieStore.set({ name: 'session', value: 'test' })

    await expect(GET()).rejects.toThrow('Mock redirect error')
  })
})
