import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContentEntry } from './get-content-entry'

describe('getContentEntry', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches the content entry', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', () => {
      return {
        fetchApiData: () => {
          return { data: {}, error: undefined }
        },
      }
    })

    const { data, error } = await getContentEntry()

    expect(error).toBeUndefined()
    expect(data).toStrictEqual({})
  })
})
