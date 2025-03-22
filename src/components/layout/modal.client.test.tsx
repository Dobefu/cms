import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Modal from './modal.client'

const mockShow = vi.fn<() => void>()
const mockClose = vi.fn<() => void>()

const setup = () =>
  render(<div id="modal-root" />, { container: document.body })

describe('modal', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.show = mockShow
    HTMLDialogElement.prototype.close = mockClose
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders normally', () => {
    expect.hasAssertions()

    setup()
    render(<Modal>Modal</Modal>)

    expect(mockShow).toHaveBeenCalledWith()
  })

  it('closes the modal when clicking on the backdrop', async () => {
    expect.hasAssertions()

    setup()
    render(<Modal>Modal</Modal>)

    expect(mockShow).toHaveBeenCalledWith()

    fireEvent.click(screen.getByTestId('modal-backdrop'))

    await waitFor(() => {
      expect(screen.queryByTestId('modal-backdrop')).toBeNull()
    })
  })
})
