import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Input from './input'

describe('input', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a textbox', () => {
    expect.hasAssertions()

    render(<Input />)

    expect(screen.getByRole('textbox')).toBeDefined()
  })

  it('renders a button', () => {
    expect.hasAssertions()

    render(<Input type="button" />)

    expect(screen.getByRole('button')).toBeDefined()
  })

  it('renders a submit', () => {
    expect.hasAssertions()

    render(<Input type="submit" />)

    expect(screen.getByRole('button')).toBeDefined()
  })
})
