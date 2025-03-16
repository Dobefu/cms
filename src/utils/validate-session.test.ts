import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateSession } from './validate-session'

describe('getUserData', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
  })

  it('validates the user session', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', async () => {
      return {
        fetchApiData: () => {
          return { data: {}, error: undefined }
        },
      }
    })

    const { isAnonymous, token } = await validateSession()

    expect(isAnonymous).toBe(true)
    expect(token).toBeUndefined()
  })
})
