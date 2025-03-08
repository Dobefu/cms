import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Footer from './footer'

describe('Footer', () => {
  afterEach(() => {
    cleanup()
  })

  it('Renders normally', () => {
    render(<Footer />)

    expect(screen.getByRole('contentinfo')).toBeDefined()
  })
})
