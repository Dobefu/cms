import { fetchApiData } from '@/utils/fetch-api-data'
import { describe, expect, it, vi } from 'vitest'
import { deleteContentType } from './delete-content-type'

describe('deleteContentType', () => {
  vi.mock('@/utils/fetch-api-data', async () => ({
    fetchApiData: ({ path }: (typeof fetchApiData)['arguments']) => {
      if (path === '/content-type/1') {
        return { data: { content_type: { id: 1 } }, error: undefined }
      }

      return { data: undefined, error: new Error('') }
    },
  }))

  it('returns early when the fetch call fails', async () => {
    expect.hasAssertions()

    const { success } = await deleteContentType(0)

    expect(success).toBe(false)
  })

  it('returns a success status', async () => {
    expect.hasAssertions()

    const { success } = await deleteContentType(1)

    expect(success).toBe(true)
  })
})
