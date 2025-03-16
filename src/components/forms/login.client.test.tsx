import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LoginForm, { initialState } from './login.client'

describe('loginForm', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    render(<LoginForm />)

    expect(screen.getByRole<HTMLInputElement>('textbox').name).toBe('username')
    expect(screen.getByRole<HTMLInputElement>('button').type).toBe('submit')
  })

  it('can submit', async () => {
    expect.hasAssertions()

    render(<LoginForm />)

    const usernameInput = screen.getByTestId('username')
    const passwordInput = screen.getByTestId('password')

    expect(usernameInput).toBeDefined()
    expect(passwordInput).toBeDefined()

    fireEvent.change(usernameInput, { target: { value: 'Username' } })
    fireEvent.change(passwordInput, { target: { value: 'Password' } })

    fireEvent.click(screen.getByRole<HTMLInputElement>('button'))

    expect(screen).toBeDefined()
  })

  it('renders with errors', () => {
    expect.hasAssertions()

    initialState.username = 'Username'
    initialState.errors.username = ['Username error']
    initialState.errors.password = ['Password error']
    initialState.errors.generic = ['Generic error']

    render(<LoginForm />)

    const paragraphs = screen.getAllByRole<HTMLParagraphElement>('paragraph')

    expect(paragraphs).toHaveLength(3)
    expect(paragraphs[0].textContent).toBe('Username error')
    expect(paragraphs[1].textContent).toBe('Password error')
    expect(paragraphs[2].textContent).toBe('Generic error')
  })
})
