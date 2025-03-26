import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContentTypes } from './get-content-types'

describe('getContentTypes', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches the content types', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', () => ({
      fetchApiData: () => ({
        data: {},
        error: undefined,
      }),
    }))

    const { data, error } = await getContentTypes()

    expect(error).toBeUndefined()
    expect(data).toStrictEqual({})
  })
})
