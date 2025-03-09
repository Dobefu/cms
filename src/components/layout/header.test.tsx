import { cleanup, render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Header from './header'

describe('header', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test' }, error: null }),
      ok: true,
      status: 200,
    })
  })

  afterEach(async () => {
    cleanup()
    vi.restoreAllMocks()

    const cookieStore = await cookies()
    cookieStore.delete('session')
  })

  it('renders for an anonymous user', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    render(await Header())

    const links = screen.getAllByRole<HTMLAnchorElement>('link')

    expect(links).toHaveLength(3)
    expect(links[0].ariaLabel).toBe('Homepage')
    expect(links[1].textContent).toBe('My account')
    expect(links[2].textContent).toBe('Log out')
  })

  it('renders for an authenticated user', async () => {
    expect.hasAssertions()

    render(await Header())

    const links = screen.getAllByRole<HTMLAnchorElement>('link')

    expect(links).toHaveLength(2)
    expect(links[0].ariaLabel).toBe('Homepage')
    expect(links[1].textContent).toBe('Login')
  })
})
