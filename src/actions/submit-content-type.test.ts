import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type FormState, submitContentType } from './submit-content-type'

export const initialState: FormState = {
  type: 'create',
  title: '',
  errors: {
    title: undefined,
    generic: undefined,
  },
}

describe('submitContentType', () => {
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
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('title', 'Title')

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('title', 'Title')

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early with missing data', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()

    await submitContentType(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when a failed response has an error object', async () => {
    expect.hasAssertions()

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

  it('redirects on successful form submission', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    initialState.type = 'update'

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
})
