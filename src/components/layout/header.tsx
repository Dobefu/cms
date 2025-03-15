import { validateSession } from '@/utils/validate-session'
import iconAccount from '@iconify/icons-mdi/account'
import iconLogin from '@iconify/icons-mdi/login'
import iconLogout from '@iconify/icons-mdi/logout'
import { Icon, type IconifyIcon } from '@iconify/react'
import Link from 'next/link'

export default async function Header() {
  const { isAnonymous } = await validateSession()
  let links: { title: string; href: string; icon: IconifyIcon | string }[]

  if (isAnonymous) {
    links = [
      {
        title: 'Login',
        href: '/login',
        icon: iconLogin,
      },
    ]
  } else {
    links = [
      {
        title: 'My account',
        href: '/user',
        icon: iconAccount,
      },
      {
        title: 'Log out',
        href: '/logout',
        icon: iconLogout,
      },
    ]
  }

  return (
    <header className="sticky top-0 bg-inherit p-4">
      <nav aria-label="Navigation menu" className="flex items-center gap-4">
        <div className="flex-1 text-2xl font-medium">
          <Link aria-label="Homepage" href={isAnonymous ? '/' : '/dashboard'}>
            {process.env.APP_NAME}
          </Link>
        </div>

        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              className="flex items-center gap-1 py-2 font-medium"
              href={link.href}
              key={link.href}
            >
              <Icon className="size-4" icon={link.icon} ssr />

              {link.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
