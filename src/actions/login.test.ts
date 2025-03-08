import * as navigation from 'next/navigation'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { login } from './login'

describe('Login', () => {
  afterEach(() => {
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

  it('Returns early with missing data', async () => {
    const spy = vi.spyOn(navigation, 'redirect')

    const formData = new FormData()

    await login(formData)
    expect(spy).not.toHaveBeenCalled()
  })
})
