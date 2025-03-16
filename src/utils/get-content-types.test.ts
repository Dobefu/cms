import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContentTypes } from './get-content-types'

describe('getContentTypes', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
  })

  it('fetches the content types', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', async () => {
      return {
        fetchApiData: () => {
          return { data: {}, error: undefined }
        },
      }
    })

    const { data, error } = await getContentTypes()

    expect(error).toBeUndefined()
    expect(data).toStrictEqual({})
  })
})
