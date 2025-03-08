import Link from 'next/link'

export default function Header() {
  const links = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: '404',
      href: '/2',
    },
  ]

  return (
    <header className="sticky top-0 p-4">
      <nav aria-label="Navigation menu" className="flex items-center gap-4">
        <div className="flex-1 text-2xl font-medium">
          <Link aria-label="Homepage" href="/" role="navigation">
            {process.env.APP_NAME}
          </Link>
        </div>

        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              className="py-2 font-medium"
              href={link.href}
              key={link.href}
              role="navigation"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
