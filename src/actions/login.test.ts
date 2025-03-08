import * as navigation from 'next/navigation'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login } from './login'

describe('Login', () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => {
      return Promise.resolve(JSON.stringify(''))
    },
  })

  afterEach(() => {
    process.env.API_ENDPOINT = 'http://api-endpoint'
    vi.restoreAllMocks()
  })

  it('Redirects', async () => {
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(formData)
    expect(spy).toHaveBeenCalled()
  })

  it('Returns early when the API endpoint is missing', async () => {
    delete process.env.API_ENDPOINT
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(formData)
    expect(spy).not.toHaveBeenCalled()
  })

  it('Returns an error when the fetch call fails', async () => {
    const spy = vi.spyOn(navigation, 'redirect')

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => {
        return Promise.resolve(JSON.stringify(''))
      },
    })

    const formData = new FormData()
    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(formData)
    expect(spy).not.toHaveBeenCalled()
  })

  it('Returns early with missing data', async () => {
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()

    await login(formData)
    expect(spy).not.toHaveBeenCalled()
  })
})
