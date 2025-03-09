import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Heading from './heading'

describe('heading', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally (h1)', () => {
    expect.hasAssertions()

    render(<Heading level={1}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-3xl')
  })

  it('renders normally (h2)', () => {
    expect.hasAssertions()

    render(<Heading level={2}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-2xl')
  })

  it('renders normally (h3)', () => {
    expect.hasAssertions()

    render(<Heading level={3}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-xl')
  })

  it('renders normally (h4)', () => {
    expect.hasAssertions()

    render(<Heading level={4}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-lg')
  })

  it('renders normally (h5)', () => {
    expect.hasAssertions()

    render(<Heading level={5}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-md')
  })

  it('renders normally (h6)', () => {
    expect.hasAssertions()

    render(<Heading level={6}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-sm')
  })

  it('does not render on invalid levels', () => {
    expect.hasAssertions()

    render(<Heading level={0}>TITLE</Heading>)

    expect(screen.queryByRole('heading')).toBeNull()
  })
})
