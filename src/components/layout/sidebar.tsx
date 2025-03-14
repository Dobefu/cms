import Link from 'next/link'

export default function Sidebar() {
  const links = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
  ]

  return (
    <nav className="flex max-w-xs flex-1 flex-col py-4">
      {links.map((link) => (
        <Link
          className="me-4 rounded-e-full p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
          href={link.href}
          key={link.href}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  )
}
