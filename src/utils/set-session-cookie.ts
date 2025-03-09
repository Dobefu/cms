import { cookies } from 'next/headers'

async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'session',
    value: token,
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: 86400 * 30,
  })
}

export { setSessionCookie }
