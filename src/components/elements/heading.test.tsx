import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Heading from './heading'

describe('heading', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    for (let i = 0; i < 6; i++) {
      render(<Heading level={i + 1}>TITLE</Heading>)
    }

    screen.getAllByRole('heading').forEach((heading, index) => {
      expect(heading.tagName).toBe(`H${index + 1}`)
    })
  })

  it('does not render on invalid levels', () => {
    expect.hasAssertions()

    render(<Heading level={0}>TITLE</Heading>)

    expect(screen.queryByRole('heading')).toBeNull()
  })
})
