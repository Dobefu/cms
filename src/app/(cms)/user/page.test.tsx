import { type UserData } from '@/types/user-data'
import { render } from '@testing-library/react'
import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import User, { generateMetadata } from './page'

const userData: UserData = {
  id: 1,
  username: 'test-username',
  email: 'test-email',
  status: true,
  created_at: new Date(),
  updated_at: new Date(),
  last_login: new Date(),
}

describe('user', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: undefined, error: new Error('') }),
      ok: false,
      status: 500,
    })
  })

  afterEach(async () => {
    vi.restoreAllMocks()

    const cookieStore = await cookies()
    cookieStore.delete('session')
  })

  it('returns an empty metadata object when the getUserData response has an error', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const metadata = await generateMetadata()

    expect(metadata).toStrictEqual({})
  })

  it('returns metadata when logged in', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () =>
        Promise.resolve({
          data: { user: userData },
          error: null,
        }),
      ok: true,
      status: 200,
    })

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    const metadata = await generateMetadata()

    expect(metadata).toBeDefined()
    expect(metadata).not.toStrictEqual({})
  })

  it('returns early when the getUserData response has an error', async () => {
    expect.hasAssertions()

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    await expect(User()).rejects.toThrow('Mock notFound error')
  })

  it('renders normally for logged in users', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () =>
        Promise.resolve({
          data: { user: userData },
          error: null,
        }),
      ok: true,
      status: 200,
    })

    const spy = vi.spyOn(navigation, 'redirect')

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    render(await User())

    expect(spy).not.toHaveBeenCalled()
  })
})
