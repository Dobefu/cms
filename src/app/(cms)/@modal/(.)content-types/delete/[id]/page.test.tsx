import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DeleteContentTypeModal from './page'

const setup = () =>
  render(<div id="modal-root" />, { container: document.body })

describe('deleteContentType', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    setup()
    render(DeleteContentTypeModal({ params: Promise.resolve({ id: '1' }) }))

    expect(screen).toBeDefined()
  })
})
