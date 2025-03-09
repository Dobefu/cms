import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { setSessionCookie } from './utils/set-session-cookie'
import { validateSession } from './utils/validate-session'

let cachedCspString: string | undefined

export async function middleware() {
  await refreshSessionToken()

  const response = getCspResponse()

  return response
}

async function refreshSessionToken() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('session')

  if (!tokenCookie) {
    return
  }

  const { token } = await validateSession()

  if (token && tokenCookie.value !== token) {
    setSessionCookie(token)
  }
}

function getCspResponse(): NextResponse {
  const response = NextResponse.next()

  if (cachedCspString) {
    response.headers.set('Content-Security-Policy', cachedCspString)
    return response
  }

  const csp: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'connect-src': ["'self'"],
    'style-src': ["'self'", `'unsafe-inline'`],
    'img-src': ["'self'", 'blob:', 'data:'],
    'font-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  }

  if (process.env.NODE_ENV !== 'production') {
    csp['script-src'].push("'unsafe-eval'")
    csp['upgrade-insecure-requests'] = []
  }

  const cspString = parseCsp(csp)
  cachedCspString = cspString

  response.headers.set('Content-Security-Policy', cspString)

  return response
}

function parseCsp(csp: Record<string, string[]>): string {
  const output = []

  for (const [key, value] of Object.entries(csp)) {
    output.push(`${key} ${value.join(' ')}`)
  }

  return output.join('; ') + ';'
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|manifest.webmanifest|.+.svg|.+.png|.+.jpg|.+.gif).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
