import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ToastContext from './toast-context.client'

describe('toastContext', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<ToastContext>Children</ToastContext>)

    expect(screen).toBeDefined()
  })
})
