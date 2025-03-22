import { useState } from 'react'
import { vi } from 'vitest'

process.env.MOCK_PATHNAME = '/'
process.env.API_ENDPOINT = 'http://api-endpoint'
process.env.API_KEY = 'test-api-key'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')

  return {
    ...actual,
    useContext: () => undefined,
    useActionState: (_action: () => unknown, initialState: unknown) => {
      const [isPending, setIsPending] = useState(false)

      return [
        initialState,
        vi.fn(() => {
          setIsPending(true)
        }),
        isPending,
      ]
    },
  }
})

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')

  return {
    ...(actual as object),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      back: vi.fn(),
    })),
    notFound: vi.fn(() => {
      throw new Error('Mock notFound error')
    }),
    redirect: vi.fn(() => {
      throw new Error('Mock redirect error')
    }),
    useSearchParams: () => {
      return new URLSearchParams(process.env.MOCK_PATHNAME)
    },
    usePathname: () => {
      return process.env.MOCK_PATHNAME
    },
  }
})

vi.mock('next/headers', async () => {
  const actual = await vi.importActual('next/headers')
  const cookies: Record<string, string> = {}

  return {
    ...(actual as object),
    cookies: vi.fn(() => ({
      set: vi.fn(({ name, value }: { name: string; value: string }) => {
        cookies[name] = value
      }),
      get: vi.fn((name: string) => {
        if (!cookies[name]) {
          return
        }

        return { name, value: cookies[name] }
      }),
      delete: vi.fn((name: string) => delete cookies[name]),
    })),
  }
})

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
