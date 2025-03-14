import { render } from '@testing-library/react'
import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import Dashboard from './page'

describe('dashboard', () => {
  it('renders normally', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    render(await Dashboard())

    expect(spy).not.toHaveBeenCalled()
  })
})
