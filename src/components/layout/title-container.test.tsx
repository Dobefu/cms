import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TitleContainer from './title-container'

describe('container', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<TitleContainer>test</TitleContainer>)

    expect(screen).toBeDefined()
  })
})
