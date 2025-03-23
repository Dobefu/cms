import { fetchApiData } from '@/utils/fetch-api-data'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteContentEntry } from './delete-content-entry'

let formData: FormData

describe('deleteContentEntry', () => {
  beforeEach(() => {
    formData = new FormData()
  })

  vi.mock('@/utils/fetch-api-data', () => ({
    fetchApiData: ({ path }: (typeof fetchApiData)['arguments']) => {
      if (path === '/content/1') {
        return { data: { content: { id: 1 } }, error: undefined }
      }

      return { data: undefined, error: new Error('') }
    },
  }))

  it('returns early when the fetch call fails', async () => {
    expect.hasAssertions()

    const { success } = await deleteContentEntry(undefined, formData)

    expect(success).toBe(false)
  })

  it('returns a success status', async () => {
    expect.hasAssertions()

    formData.append('id', '1')

    const { success } = await deleteContentEntry(undefined, formData)

    expect(success).toBe(true)
  })
})
