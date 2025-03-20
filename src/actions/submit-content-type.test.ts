import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type FormState, submitContentType } from './submit-content-type'

export const initialState: FormState = {
  title: '',
  errors: {
    title: undefined,
    generic: undefined,
  },
}

describe('submitContentType', () => {
  const oldApiEndpoint = process.env.API_ENDPOINT

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: false,
      status: 422,
    })
  })

  afterEach(async () => {
    process.env.API_ENDPOINT = oldApiEndpoint
    vi.restoreAllMocks()

    const cookieStore = await cookies()
    cookieStore.delete('session')
  })

  it('returns early when the session token cookie is missing', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when the API endpoint is missing', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    delete process.env.API_ENDPOINT
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('title', 'Title')

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('title', 'Title')

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when there is missing data', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when a failed response has an error object', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const spy = vi.spyOn(navigation, 'redirect')

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: 'test error' }),
      ok: false,
      status: 422,
    })

    const formData = new FormData()
    formData.append('title', 'Title')

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when a response token is missing', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const spy = vi.spyOn(navigation, 'redirect')

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: null }),
      ok: true,
      status: 200,
    })

    const formData = new FormData()
    formData.append('title', 'Title')

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('redirects when creating a new content type', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { id: 1 }, error: null }),
      ok: true,
      status: 200,
    })

    const formData = new FormData()
    formData.append('title', 'Title')

    await expect(submitContentType(initialState, formData)).rejects.toThrow(
      'Mock redirect error',
    )
  })

  it('does not redirect when updating a content type', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    initialState.id = 1
    const spy = vi.spyOn(navigation, 'redirect')

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { id: 1 }, error: null }),
      ok: true,
      status: 200,
    })

    const formData = new FormData()
    formData.append('title', 'Title')

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })
})
