import { render } from '@testing-library/react'
import { cookies } from 'next/headers'
import * as navigation from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import ContentTypes from './page'

describe('content-types', () => {
  it('renders normally', async () => {
    expect.hasAssertions()

    const spy = vi.spyOn(navigation, 'redirect')

    const cookieStore = await cookies()
    cookieStore.set({ name: 'session', value: 'test' })

    render(await ContentTypes())

    expect(spy).not.toHaveBeenCalled()
  })
})
