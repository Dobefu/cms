import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Login from './page'

describe('login', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<Login />)

    expect(screen).toBeDefined()
  })
})
