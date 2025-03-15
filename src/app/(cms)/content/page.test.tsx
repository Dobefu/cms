import { render } from '@testing-library/react'
import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import Content from './page'

describe('content', () => {
  it('renders normally', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    render(await Content())

    expect(spy).not.toHaveBeenCalled()
  })
})
