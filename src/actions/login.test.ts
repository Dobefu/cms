import * as navigation from 'next/navigation'
import {
  type MockInstance,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { type FormState, login } from './login'

let initialState: FormState
let spy: MockInstance
let formData: FormData

describe('login action', () => {
  const oldApiEndpoint = process.env.API_ENDPOINT
  const oldApiKey = process.env.API_KEY

  beforeEach(() => {
    spy = vi.spyOn(navigation, 'redirect')
    formData = new FormData()

    initialState = {
      username: '',
      errors: {},
    }

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({}),
      ok: false,
      status: 422,
    })
  })

  afterEach(() => {
    process.env.API_ENDPOINT = oldApiEndpoint
    process.env.API_KEY = oldApiKey

    vi.restoreAllMocks()
  })

  it('returns early when the API endpoint is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_ENDPOINT

    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when the API key is missing', async () => {
    expect.hasAssertions()

    delete process.env.API_KEY

    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early with missing data', async () => {
    expect.hasAssertions()

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when a failed response has an error object', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: 'test error' }),
      ok: false,
      status: 422,
    })

    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when a response token is missing', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: null }),
      ok: true,
      status: 200,
    })

    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await login(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('redirects on successful login', async () => {
    expect.hasAssertions()

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { token: 'test' }, error: null }),
      ok: true,
      status: 200,
    })

    formData.append('username', 'Username')
    formData.append('password', 'Password')

    await expect(login(initialState, formData)).rejects.toThrow(
      'Mock redirect error',
    )
  })
})
