import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DeleteContentEntryModal from './page'

const setup = () =>
  render(<div id="modal-root" />, { container: document.body })

describe('deleteContentEntry', () => {
  it('renders normally', () => {
    expect.hasAssertions()

    setup()
    render(DeleteContentEntryModal({ params: Promise.resolve({ id: '1' }) }))

    expect(screen).toBeDefined()
  })
})
