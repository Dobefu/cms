import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContentType } from './get-content-type'

describe('getContentType', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
  })

  it('fetches the content type', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', async () => {
      return {
        fetchApiData: () => {
          return { data: {}, error: undefined }
        },
      }
    })

    const { data, error } = await getContentType(1)

    expect(error).toBeUndefined()
    expect(data).toStrictEqual({})
  })
})
