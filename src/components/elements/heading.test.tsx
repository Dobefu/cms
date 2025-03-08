import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Heading from './heading'

describe('Heading', () => {
  afterEach(() => {
    cleanup()
  })

  it('Renders normally (h1)', () => {
    render(<Heading level={1}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-3xl')
  })

  it('Renders normally (h2)', () => {
    render(<Heading level={2}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-2xl')
  })

  it('Renders normally (h3)', () => {
    render(<Heading level={3}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-xl')
  })

  it('Renders normally (h4)', () => {
    render(<Heading level={4}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-lg')
  })

  it('Renders normally (h5)', () => {
    render(<Heading level={5}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-md')
  })

  it('Renders normally (h6)', () => {
    render(<Heading level={6}>TITLE</Heading>)

    expect(screen.getByRole('heading').className).toContain('text-sm')
  })

  it('Does not render on invalid levels', () => {
    render(<Heading level={0}>TITLE</Heading>)

    expect(screen.queryByRole('heading')).toBeNull()
  })
})
