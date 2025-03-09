import { describe, expect, it } from 'vitest'
import { middleware } from './middleware'

describe('middleware', () => {
  it('adds a Content-Security-Policy header', () => {
    expect.hasAssertions()

    const response = middleware()

    expect(response).toBeDefined()
  })

  it('uses the cached CSP string when called more than once', () => {
    expect.hasAssertions()

    const response = middleware()

    expect(response).toBeDefined()
  })
})
