import { fetchApiData } from '@/utils/fetch-api-data'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteContentType } from './delete-content-type'

let formData: FormData

describe('deleteContentType', () => {
  beforeEach(() => {
    formData = new FormData()
  })

  vi.mock('@/utils/fetch-api-data', () => ({
    fetchApiData: ({ path }: (typeof fetchApiData)['arguments']) => {
      if (path === '/content-type/1') {
        return { data: { content_type: { id: 1 } }, error: undefined }
      }

      return { data: undefined, error: new Error('') }
    },
  }))

  it('returns early when the fetch call fails', async () => {
    expect.hasAssertions()

    const { success } = await deleteContentType(undefined, formData)

    expect(success).toBe(false)
  })

  it('returns a success status', async () => {
    expect.hasAssertions()

    formData.append('id', '1')

    const { success } = await deleteContentType(undefined, formData)

    expect(success).toBe(true)
  })
})
