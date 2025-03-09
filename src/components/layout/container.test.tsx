import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Container from './container'

describe('container', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Container>test</Container>)

    expect(screen).toBeDefined()
  })
})
