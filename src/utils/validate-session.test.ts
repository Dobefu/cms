import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateSession } from './validate-session'

describe('getUserData', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('validates the user session', async () => {
    expect.hasAssertions()

    vi.mock('@/utils/fetch-api-data', () => {
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
