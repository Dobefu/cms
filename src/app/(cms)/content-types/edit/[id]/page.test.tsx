import { fetchApiData } from '@/utils/fetch-api-data'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EditContentType from './page'

describe('content-types/edit/[id]', () => {
  vi.mock('@/utils/fetch-api-data', async () => ({
    fetchApiData: ({ path }: (typeof fetchApiData)['arguments']) => {
      if (path === '/content-type/1') {
        return { data: { content_type: { id: 1 } }, error: undefined }
      }

      return { data: undefined, error: new Error('') }
    },
  }))

  it('redirects if a content type does not exist', async () => {
    expect.hasAssertions()

    await expect(
      EditContentType({ params: Promise.resolve({ id: 0 }) }),
    ).rejects.toThrow('Mock notFound error')
  })

  it('renders normally', async () => {
    expect.hasAssertions()

    render(await EditContentType({ params: Promise.resolve({ id: 1 }) }))

    expect(screen).toBeDefined()
  })
})
