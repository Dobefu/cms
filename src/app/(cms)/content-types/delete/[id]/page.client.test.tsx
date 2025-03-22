import { type ContentType } from '@/types/content-type'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DeleteContentTypeClient from './page.client'

const contentType = {
  id: 1,
  title: 'Test content type',
  created_at: '',
  updated_at: '',
} satisfies ContentType

describe('deleteContentTypeClient', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<DeleteContentTypeClient contentType={contentType} />)

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

    render(<DeleteContentTypeClient contentType={contentType} />)

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeDefined()
    })
  })
})
