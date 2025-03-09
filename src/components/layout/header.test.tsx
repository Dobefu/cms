import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Header from './header'

describe('header', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<Header />)

    expect(screen.getByRole('banner')).toBeDefined()
    expect(screen.getAllByRole('navigation')).toBeDefined()
  })
})
