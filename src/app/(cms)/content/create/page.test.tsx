import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CreateContent from './page'

let shouldError: boolean

describe('content/create', () => {
  beforeEach(() => {
    shouldError = false
  })

  vi.mock('@/actions/get-content-types', () => {
    return {
      getContentTypes: () => {
        if (!shouldError) {
          return {
            data: { content_types: [{ id: 1 }] },
            error: undefined,
          }
        }

        return {
          data: undefined,
          error: 'Cannot get content types',
        }
      },
    }
  })

  it('returns early when no content types could be fetched', async () => {
    expect.hasAssertions()

    shouldError = true

    await expect(CreateContent()).rejects.toThrow('Mock notFound error')
  })

  it('renders normally', async () => {
    expect.hasAssertions()

    render(await CreateContent())

    expect(screen).toBeDefined()
  })
})
