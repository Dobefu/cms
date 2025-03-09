import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FormError from './form-error'

describe('formError', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<FormError>Some error</FormError>)

    expect(screen.getByText('Some error')).toBeDefined()
  })
})
