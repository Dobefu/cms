import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ContentTypeForm, { initialState } from './content-type.client'

describe('contentTypeForm', () => {
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

  vi.mock('react', async () => ({
    ...(await vi.importActual('react')),
    useContext: () => ({
      showToast: (message: string) => {
        throw new Error(message)
      },
    }),
  }))

  it('renders normally', () => {
    expect.hasAssertions()

    render(<ContentTypeForm />)

    expect(screen.getByRole<HTMLInputElement>('textbox').name).toBe('title')
    expect(screen.getByRole<HTMLInputElement>('button').type).toBe('submit')
  })

  it('can submit (type: create)', () => {
    expect.hasAssertions()

    render(<ContentTypeForm />)

    const titleInput = screen.getByTestId('title')

    expect(titleInput).toBeDefined()

    fireEvent.change(titleInput, { target: { value: 'test' } })
    fireEvent.click(screen.getByRole<HTMLInputElement>('button'))

    expect(screen).toBeDefined()
  })

  it('can submit (type: update)', () => {
    expect.hasAssertions()

    render(<ContentTypeForm />)

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

    render(<ContentTypeForm />)

    const paragraphs = screen.getAllByRole<HTMLParagraphElement>('paragraph')

    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].textContent).toBe('Title error')
    expect(paragraphs[1].textContent).toBe('Generic error')
  })
})
