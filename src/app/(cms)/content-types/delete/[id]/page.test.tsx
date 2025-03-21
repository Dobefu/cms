import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DeleteContentType from './page'

describe('deleteContentType', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(DeleteContentType({ params: Promise.resolve({ id: '1' }) }))

    expect(screen).toBeDefined()
  })
})
