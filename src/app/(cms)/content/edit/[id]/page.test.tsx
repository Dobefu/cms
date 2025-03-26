import { fetchApiData } from '@/utils/fetch-api-data'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EditContentEntry from './page'

describe('content/edit/[id]', () => {
  vi.mock('react', async () => ({
    ...(await vi.importActual('react')),
    useContext: () => ({
      showToast: (message: string) => {
        throw new Error(message)
      },
    }),
  }))

  vi.mock('@/utils/fetch-api-data', () => ({
    fetchApiData: ({ path }: (typeof fetchApiData)['arguments']) => {
      if (path === '/content/1') {
        return {
          data: { content: { id: 1, content_type: { id: 1 } } },
          error: undefined,
        }
      }

      return { data: undefined, error: new Error('') }
    },
  }))

  it('redirects if a content does not exist', async () => {
    expect.hasAssertions()

    await expect(
      EditContentEntry({ params: Promise.resolve({ id: 0 }) }),
    ).rejects.toThrow('Mock notFound error')
  })

  it('renders normally', async () => {
    expect.hasAssertions()

    render(await EditContentEntry({ params: Promise.resolve({ id: 1 }) }))

    expect(screen).toBeDefined()
  })
})
