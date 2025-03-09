import { validateSession } from '@/utils/validate-session'
import Link from 'next/link'

export default async function Header() {
  const { isAnonymous } = await validateSession()
  let links: { title: string; href: string }[]

  if (isAnonymous) {
    links = [
      {
        title: 'Login',
        href: '/login',
      },
    ]
  } else {
    links = [
      {
        title: 'My account',
        href: '/user',
      },
      {
        title: 'Log out',
        href: '/logout',
      },
    ]
  }

  return (
    <header className="sticky top-0 p-4">
      <nav aria-label="Navigation menu" className="flex items-center gap-4">
        <div className="flex-1 text-2xl font-medium">
          <Link aria-label="Homepage" href="/">
            {process.env.APP_NAME}
          </Link>
        </div>

        <div className="flex gap-4">
          {links.map((link) => (
            <Link className="py-2 font-medium" href={link.href} key={link.href}>
              {link.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
