import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './footer'

describe('footer', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeDefined()
  })
})
