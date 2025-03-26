import { afterEach, describe, expect, it, vi } from 'vitest'
import { getContent } from './get-content'

describe('getContent', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches the content', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', () => ({
      fetchApiData: () => ({
        data: {},
        error: undefined,
      }),
    }))

    const { data, error } = await getContent()

    expect(error).toBeUndefined()
    expect(data).toStrictEqual({})
  })
})
