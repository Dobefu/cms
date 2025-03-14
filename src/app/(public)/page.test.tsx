import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Homepage from './page'

describe('homepage', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Homepage />)

    expect(screen).toBeDefined()
  })
})
