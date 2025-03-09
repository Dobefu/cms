import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import FormError from './form-error'

describe('formError', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<FormError>Some error</FormError>)

    expect(screen.getByText('Some error')).toBeDefined()
  })
})
