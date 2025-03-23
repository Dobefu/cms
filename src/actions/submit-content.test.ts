import { cookies } from 'next/headers'
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
import { type FormState, submitContent } from './submit-content'

let initialState: FormState
let spy: MockInstance
let formData: FormData
const cookieStore = await cookies()

describe('submitContent', () => {
  const oldApiEndpoint = process.env.API_ENDPOINT

  beforeEach(() => {
    spy = vi.spyOn(navigation, 'redirect')
    formData = new FormData()

    initialState = {
      title: '',
      errors: {
        title: undefined,
        generic: undefined,
      },
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
    vi.restoreAllMocks()

    cookieStore.delete('session')
  })

  vi.mock('react', async () => {
    const actual = await vi.importActual('react')

    return {
      ...actual,
      useContext: () => ({
        showToast: (message: string) => {
          throw new Error(message)
        },
      }),
    }
  })

  it('returns early when the session token cookie is missing', async () => {
    expect.hasAssertions()

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when the API endpoint is missing', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    delete process.env.API_ENDPOINT

    formData.append('title', 'Title')

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns a JSON error when the fetch call fails', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    formData.append('title', 'Title')

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when there is missing data', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when a failed response has an error object', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: 'test error' }),
      ok: false,
      status: 422,
    })

    formData.append('title', 'Title')

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('returns early when a response token is missing', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: null, error: null }),
      ok: true,
      status: 200,
    })

    formData.append('title', 'Title')

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('does not redirect when creating new content', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { id: 1 }, error: null }),
      ok: true,
      status: 200,
    })

    formData.append('title', 'Title')

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })

  it('does not redirect when updating content', async () => {
    expect.hasAssertions()

    cookieStore.set({ name: 'session', value: 'test' })

    initialState.id = 1

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ...new Response(),
      json: () => Promise.resolve({ data: { id: 1 }, error: null }),
      ok: true,
      status: 200,
    })

    formData.append('title', 'Title')

    await submitContent(initialState, formData)

    expect(spy).not.toHaveBeenCalled()
  })
})
