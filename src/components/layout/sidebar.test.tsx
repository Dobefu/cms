import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Sidebar from './sidebar'

describe('sidebar', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<Sidebar isCollapsedInitial={false} />)

    expect(screen.getByRole('navigation')).toBeDefined()
  })

  it('can be toggled', () => {
    expect.hasAssertions()

    render(<Sidebar isCollapsedInitial={false} />)

    expect(
      screen.queryByRole('navigation')?.getAttribute('data-collapsed'),
    ).toBeNull()

    fireEvent.click(screen.getByRole<HTMLInputElement>('button'))

    expect(
      screen.queryByRole('navigation')?.getAttribute('data-collapsed'),
    ).toBe('true')

    fireEvent.click(screen.getByRole<HTMLInputElement>('button'))

    expect(
      screen.queryByRole('navigation')?.getAttribute('data-collapsed'),
    ).toBeNull()
  })
})
