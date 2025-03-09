import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import NotFound from './not-found'

describe('notFound', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<NotFound />)

    expect(screen.getByRole('heading')).toBeDefined()
    expect(screen.getByRole('paragraph')).toBeDefined()
  })
})
