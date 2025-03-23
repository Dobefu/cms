import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ContentForm, { initialState } from './content.client'

describe('contentForm', () => {
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

    render(<ContentForm />)

    expect(screen.getByRole<HTMLInputElement>('textbox').name).toBe('title')
    expect(screen.getByRole<HTMLInputElement>('button').type).toBe('submit')
  })

  it('can submit (type: create)', () => {
    expect.hasAssertions()

    render(<ContentForm />)

    const titleInput = screen.getByTestId('title')

    expect(titleInput).toBeDefined()

    fireEvent.change(titleInput, { target: { value: 'test' } })
    fireEvent.click(screen.getByRole<HTMLInputElement>('button'))

    expect(screen).toBeDefined()
  })

  it('can submit (type: update)', () => {
    expect.hasAssertions()

    render(<ContentForm />)

    const titleInput = screen.getByTestId('title')

    expect(titleInput).toBeDefined()

    fireEvent.change(titleInput, { target: { value: 'Title' } })
    fireEvent.click(screen.getByRole<HTMLInputElement>('button'))

    expect(screen).toBeDefined()
  })

  it('renders with errors', () => {
    expect.hasAssertions()

    initialState.title = 'Title'
    initialState.errors.title = ['Title error']
    initialState.errors.generic = ['Generic error']

    render(<ContentForm />)

    const paragraphs = screen.getAllByRole<HTMLParagraphElement>('paragraph')

    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].textContent).toBe('Title error')
    expect(paragraphs[1].textContent).toBe('Generic error')
  })
})
