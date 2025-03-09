import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Homepage from './page'

describe('Homepage', () => {
  afterEach(() => {
    cleanup()
  })

  it('Renders normally', () => {
    render(<Homepage />)

    expect(screen).toBeDefined()
  })
})
