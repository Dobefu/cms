import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ReturnLink from './return-link'

describe('return-link', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<ReturnLink href="/">test</ReturnLink>)

    expect(screen).toBeDefined()
  })
})
