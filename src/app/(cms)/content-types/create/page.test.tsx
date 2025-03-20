import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CreateContentType from './page'

describe('content-types/create', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<CreateContentType />)

    expect(screen).toBeDefined()
  })
})
