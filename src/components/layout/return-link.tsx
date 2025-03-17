import iconBack from '@iconify/icons-mdi/arrow-left'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import React from 'react'

export type Props = Readonly<{
  children: React.ReactNode
  href: React.ComponentProps<typeof Link>['href']
}>

export default function ReturnLink({ children, href }: Props) {
  return (
    <Link
      className="flex items-center gap-2 py-2 transition-all max-lg:-mt-4 max-md:mt-0 max-sm:pb-0"
      href={href}
    >
      <Icon className="size-4 shrink-0" icon={iconBack} ssr />

      {children}
    </Link>
  )
}
