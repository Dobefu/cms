import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Default from './default'

describe('default', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Default />)

    expect(screen).toBeDefined()
  })
})
