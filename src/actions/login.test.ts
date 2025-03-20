import * as navigation from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type FormState, login } from './login'

export const initialState: FormState = {
  username: '',
  errors: {
    username: undefined,
    password: undefined,
    generic: undefined,
  },
}

describe('login', () => {
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
  })

  it('returns early when the API endpoint is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_ENDPOINT
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when the API key is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_KEY
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early with missing data', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()

    await login(initialState, formData)

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
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

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
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('redirects on successful login', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test' }, error: null }),
      ok: true,
      status: 200,
    })

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await expect(login(initialState, formData)).rejects.toThrow(
      'Mock redirect error',
    )
  })
})
