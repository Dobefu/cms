import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Container from './container'

describe('container', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<Container>test</Container>)

    expect(screen).toBeDefined()
  })
})
