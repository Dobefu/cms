import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Header from './header'

describe('Header', () => {
  afterEach(() => {
    cleanup()
  })

  it('Renders normally', () => {
    render(<Header />)

    expect(screen.getByRole('banner')).toBeDefined()
    expect(screen.getAllByRole('navigation')).toBeDefined()
  })
})
