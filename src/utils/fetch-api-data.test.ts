import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchApiData } from './fetch-api-data'

const cookieStore = await cookies()

describe('fetchApiData', () => {
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

  it('returns early when the API endpoint is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_ENDPOINT

    const { data, error } = await fetchApiData({ method: 'GET', path: '/' })

    expect(error).toStrictEqual(new Error('API_ENDPOINT is not set'))
    expect(data).toBeUndefined()
  })

  it('returns early when the API key is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_KEY

    const { data, error } = await fetchApiData({ method: 'GET', path: '/' })

    expect(error).toStrictEqual(new Error('API_KEY is not set'))
    expect(data).toBeUndefined()
  })

  it('returns early when the session token is missing', async () => {
    expect.hasAssertions()

    const { data, error } = await fetchApiData({ method: 'GET', path: '/' })

    expect(error).toStrictEqual(new Error('No session token cookie'))
    expect(data).toBeUndefined()
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    const { data, error } = await fetchApiData({ method: 'GET', path: '/' })

    expect(error).toStrictEqual(new Error('API request to / failed'))
    expect(data).toBeUndefined()
  })

  it('can have a body when the method is POST', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    const { data } = await fetchApiData({ method: 'POST', path: '/', body: {} })

    expect(data).toBeUndefined()
  })

  it('can have a body when the method is PUT', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    const { data } = await fetchApiData({ method: 'PUT', path: '/', body: {} })

    expect(data).toBeUndefined()
  })

  it('returns early when a failed response has an error object', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: undefined, error: 'test error' }),
      ok: false,
      status: 422,
    })

    cookieStore.set({ name: 'session', value: 'test' })

    const { data, error } = await fetchApiData({ method: 'GET', path: '/' })

    expect(error).toStrictEqual(new Error('API request to / failed'))
    expect(data).toBeUndefined()
  })

  it('returns an error when the response JSON is invalid', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve(JSON.parse(`{,}`)),
      ok: true,
      status: 200,
    })

    cookieStore.set({ name: 'session', value: 'test' })

    const { data, error } = await fetchApiData({ method: 'GET', path: '/' })

    expect(error).toBeInstanceOf(Error)
    expect(data).toBeUndefined()
  })

  it('returns a response when successful', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { user: {} }, error: undefined }),
      ok: true,
      status: 200,
    })

    cookieStore.set({ name: 'session', value: 'test' })

    const { data, error } = await fetchApiData({ method: 'GET', path: '/' })

    expect(error).toBeUndefined()
    expect(data).toStrictEqual({ user: {} })
  })
})
