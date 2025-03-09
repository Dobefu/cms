import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NotFound from './not-found'

describe('notFound', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<NotFound />)

    expect(screen.getByRole('heading')).toBeDefined()
    expect(screen.getByRole('paragraph')).toBeDefined()
  })
})
