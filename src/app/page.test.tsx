import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Homepage from './page'

describe('homepage', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<Homepage />)

    expect(screen).toBeDefined()
  })
})
