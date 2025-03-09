import * as navigation from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type FormState, login } from './login'

export const initialState: FormState = {
  username: '',
  errorUsername: undefined,
  errorPassword: undefined,
  errorGeneric: undefined,
}

describe('login', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    process.env.API_ENDPOINT = 'http://api-endpoint'
    vi.restoreAllMocks()
  })

  it('redirects', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).toHaveBeenCalledWith('/user')
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

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: 'Test error' }),
      ok: false,
      status: 422,
    })

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns a generic error when the fetch call fails', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: false,
      status: 422,
    })

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
})
