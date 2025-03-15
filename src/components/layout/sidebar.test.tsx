import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Sidebar from './sidebar'

describe('sidebar', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<Sidebar isCollapsedInitial={false} />)

    expect(screen.getByRole('navigation')).toBeDefined()
  })
})
