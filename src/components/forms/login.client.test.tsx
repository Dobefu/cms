import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LoginForm, { initialState } from './login.client'

describe('LoginForm', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => {
        return Promise.resolve(JSON.stringify(''))
      },
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('Renders normally', () => {
    render(<LoginForm />)

    expect(screen.getByRole<HTMLInputElement>('textbox').name).toBe('username')
    expect(screen.getByRole<HTMLInputElement>('button').type).toBe('submit')
  })

  it('Can submit', async () => {
    render(<LoginForm />)

    const usernameInput = screen.getByText('Username').querySelector('input')
    const passwordInput = screen.getByText('Password').querySelector('input')

    expect(usernameInput).toBeDefined()
    expect(passwordInput).toBeDefined()

    fireEvent.change(usernameInput!, { target: { value: 'Username' } })
    fireEvent.change(passwordInput!, { target: { value: 'Password' } })

    fireEvent.click(screen.getByRole<HTMLInputElement>('button'))

    expect(screen).toBeDefined()
  })

  it('Renders with errors', () => {
    initialState.username = 'Username'
    initialState.errorUsername = 'Username error'
    initialState.errorPassword = 'Password error'
    initialState.errorGeneric = 'Generic error'

    render(<LoginForm />)

    const paragraphs = screen.getAllByRole<HTMLParagraphElement>('paragraph')

    expect(paragraphs.length).toBe(3)
    expect(paragraphs[0].textContent).toBe('Username error')
    expect(paragraphs[1].textContent).toBe('Password error')
    expect(paragraphs[2].textContent).toBe('Generic error')
  })
})
