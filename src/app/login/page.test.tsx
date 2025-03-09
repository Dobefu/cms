import { render } from '@testing-library/react'
import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './page'

describe('login', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test' }, error: null }),
      ok: true,
      status: 200,
    })
  })

  afterEach(async () => {
    vi.restoreAllMocks()

    const cookieStore = await cookies()
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

    const spy = vi.spyOn(navigation, 'redirect')

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    render(await Login())

    expect(spy).toHaveBeenCalledWith('/user')
  })
})
