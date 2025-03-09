import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Login from './page'

describe('Login', () => {
  afterEach(() => {
    cleanup()
  })

  it('Renders normally', () => {
    render(<Login />)

    expect(screen).toBeDefined()
  })
})
