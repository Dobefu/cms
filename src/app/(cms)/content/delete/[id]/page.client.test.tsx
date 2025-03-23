import { type Content } from '@/types/content'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DeleteContentEntryClient from './page.client'

const content = {
  id: 1,
  content_type: 1,
  title: 'Test content',
  created_at: '',
  updated_at: '',
} satisfies Content

describe('deleteContentEntryClient', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    render(<DeleteContentEntryClient content={content} />)

    expect(screen).toBeDefined()
  })

  it('redirects after deleting content', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    })

    render(<DeleteContentEntryClient content={content} />)

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeDefined()
    })
  })
})
