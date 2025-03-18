import { afterEach, describe, expect, it, vi } from 'vitest'
import { getUserData } from './get-user-data'

describe('getUserData', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches the user data', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', () => {
      return {
        fetchApiData: () => {
          return { data: {}, error: undefined }
        },
      }
    })

    const { data, error } = await getUserData()

    expect(error).toBeUndefined()
    expect(data).toStrictEqual({})
  })
})
