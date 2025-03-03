import Link from 'next/link'
import { vi } from 'vitest'

process.env.MOCK_PATHNAME = '/'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost.test'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')

  return {
    ...actual,
    useContext: () => ({ locale: { code: 'en' } }),
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
    useSearchParams: () => {
      return new URLSearchParams(process.env.MOCK_PATHNAME)
    },
    usePathname: () => {
      return process.env.MOCK_PATHNAME
    },
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
