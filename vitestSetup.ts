import { useState } from 'react'
import { vi } from 'vitest'

process.env.MOCK_PATHNAME = '/'
process.env.API_ENDPOINT = 'http://api-endpoint'
process.env.API_KEY = 'test-api-key'

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useContext: () => undefined,
  useActionState: (_action: () => unknown, initialState: unknown) => {
    const [isPending, setIsPending] = useState(false)

    return [initialState, vi.fn(() => setIsPending(true)), isPending]
  },
}))

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual('next/navigation')),
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
  useSearchParams: () => new URLSearchParams(process.env.MOCK_PATHNAME),
  usePathname: () => process.env.MOCK_PATHNAME,
}))

vi.mock('next/headers', async () => {
  const cookies: Record<string, string> = {}

  return {
    ...(await vi.importActual('next/headers')),
    cookies: vi.fn(() => ({
      set: vi.fn(({ name, value }: { name: string; value: string }) => {
        cookies[name] = value
      }),
      get: vi.fn((name: string) =>
        cookies[name] ? { name, value: cookies[name] } : undefined,
      ),
      delete: vi.fn((name: string) => delete cookies[name]),
    })),
  }
})
