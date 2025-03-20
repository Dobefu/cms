import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Dashboard from './page'

describe('dashboard', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Dashboard />)

    expect(screen).toBeDefined()
  })
})
