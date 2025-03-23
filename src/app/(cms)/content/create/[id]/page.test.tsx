import { getContentType } from '@/utils/get-content-type'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CreateContent from './page'

describe('content/create/[id]', () => {
  vi.mock('react', async () => {
    const actual = await vi.importActual('react')

    return {
      ...actual,
      useContext: () => ({
        showToast: (message: string) => {
          throw new Error(message)
        },
      }),
    }
  })

  vi.mock('@/utils/get-content-type', () => {
    return {
      getContentType: (id: (typeof getContentType)['arguments']) => {
        if (id === 1) {
          return {
            data: { id: 1, content_type: { id: 1 } },
            error: undefined,
          }
        }

        return { data: undefined, error: new Error('') }
      },
    }
  })

  it('returns early when no content type could be fetched', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', () => {
      return {
        fetchApiData: () => {
          return { data: undefined, error: 'Cannot get content type' }
        },
      }
    })

    await expect(
      CreateContent({ params: Promise.resolve({ id: 'bogus' }) }),
    ).rejects.toThrow('Mock notFound error')
  })

  it('renders normally', async () => {
    expect.hasAssertions()

    render(await CreateContent({ params: Promise.resolve({ id: '1' }) }))

    expect(screen).toBeDefined()
  })
})
