import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Input from './input'

describe('Input', () => {
  afterEach(() => {
    cleanup()
  })

  it('Renders a textbox', () => {
    render(<Input />)

    expect(screen.getByRole('textbox')).toBeDefined()
  })

  it('Renders a button', () => {
    render(<Input type="button" />)

    expect(screen.getByRole('button')).toBeDefined()
  })

  it('Renders a submit', () => {
    render(<Input type="submit" />)

    expect(screen.getByRole('button')).toBeDefined()
  })
})
