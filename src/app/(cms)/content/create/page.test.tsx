import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CreateContent from './page'

describe('content/create', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<CreateContent />)

    expect(screen).toBeDefined()
  })
})
