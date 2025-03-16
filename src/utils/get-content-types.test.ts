import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getContentTypes } from './get-content-types'

describe('getContentTypes', () => {
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

    const { data, error } = await getContentTypes()

    expect(error).toStrictEqual(new Error('API_ENDPOINT is not set'))
    expect(data).toBeUndefined()
  })

  it('returns early when the session token is missing', async () => {
    expect.hasAssertions()

    const { data, error } = await getContentTypes()

    expect(error).toStrictEqual(new Error('No session token cookie'))
    expect(data).toBeUndefined()
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const { data, error } = await getContentTypes()

    expect(error).toStrictEqual(new Error('Getting content types failed'))
    expect(data).toBeUndefined()
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

    const { data, error } = await getContentTypes()

    expect(error).toStrictEqual(new Error('Getting content types failed'))
    expect(data).toBeUndefined()
  })

  it('returns a response when successful', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { content_types: {} }, error: null }),
      ok: true,
      status: 200,
    })

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const { data, error } = await getContentTypes()

    expect(error).toBeNull()
    expect(data).toStrictEqual({ content_types: {} })
  })
})
