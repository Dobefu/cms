import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Content from './page'

describe('content', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Content />)

    expect(screen).toBeDefined()
  })
})
