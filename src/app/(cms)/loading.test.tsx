import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Loading from './loading'

describe('loading', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Loading />)

    expect(screen).toBeDefined()
  })
})
