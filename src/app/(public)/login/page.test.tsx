import { render } from '@testing-library/react'
import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './page'

const cookieStore = await cookies()

describe('login', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test' }, error: null }),
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()

    cookieStore.delete('session')
  })

  it('renders normally for an anonymous user', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    render(await Login())

    expect(spy).not.toHaveBeenCalled()
  })

  it('redirects for logged in users', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    await expect(Login()).rejects.toThrow('Mock redirect error')
  })
})
