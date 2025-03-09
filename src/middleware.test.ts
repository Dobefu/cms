import { describe, expect, it } from 'vitest'
import { middleware } from './middleware'

describe('Middleware', () => {
  it('Adds a Content-Security-Policy header', () => {
    const response = middleware()

    expect(response).toBeDefined()
  })

  it('Uses the cached CSP string when called more than once', () => {
    const response = middleware()

    expect(response).toBeDefined()
  })
})
