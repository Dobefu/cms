import Link from 'next/link'
import { useState } from 'react'
import { vi } from 'vitest'

process.env.MOCK_PATHNAME = '/'
process.env.API_ENDPOINT = 'http://api-endpoint'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')

  return {
    ...actual,
    useContext: () => ({ locale: { code: 'en' } }),
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
    })),
    notFound: vi.fn(),
    redirect: vi.fn(),
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

  return {
    ...(actual as object),
    cookies: vi.fn(() => ({
      set: vi.fn(),
    })),
  }
})

vi.mock('next-view-transitions', async () => {
  return {
    Link,
  }
})

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
