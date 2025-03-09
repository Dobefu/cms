import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Footer from './footer'

describe('footer', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeDefined()
  })
})
