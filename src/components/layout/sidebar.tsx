import iconDashboard from '@iconify/icons-mdi/view-dashboard'
import { Icon, type IconifyIcon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'

export default function Sidebar() {
  const links: { title: string; href: string; icon: IconifyIcon | string }[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: iconDashboard,
    },
  ]

  return (
    <nav className="flex max-w-xs flex-1 flex-col py-4">
      {links.map((link) => (
        <Link
          className="me-4 flex items-center gap-2 rounded-e-full p-4 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
          href={link.href}
          key={link.href}
        >
          <Icon className="size-8" icon={link.icon} ssr />

          {link.title}
        </Link>
      ))}
    </nav>
  )
}
