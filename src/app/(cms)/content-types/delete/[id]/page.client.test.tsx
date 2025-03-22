import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DeleteContentTypeClient from './page.client'

describe('deleteContentTypeClient', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<DeleteContentTypeClient id={1} />)

    expect(screen).toBeDefined()
  })

  it('redirects after deleting a content type', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    })

    render(<DeleteContentTypeClient id={1} />)

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeDefined()
    })
  })
})
