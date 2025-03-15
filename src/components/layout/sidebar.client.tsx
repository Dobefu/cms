'use client'

import iconCollapse from '@iconify/icons-mdi/arrow-collapse-left'
import iconExpand from '@iconify/icons-mdi/arrow-expand-right'
import { Icon, type IconifyIcon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { useCallback, useState } from 'react'

export type Props = Readonly<{
  links: { title: string; href: string; icon: IconifyIcon | string }[]
}>

export default function Sidebar({ links }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed])

  return (
    <nav
      aria-label="Sidebar"
      className="group flex w-xs flex-col py-4 transition-all data-[collapsed]:w-20 max-md:w-20"
      data-collapsed={isCollapsed || undefined}
    >
      <div className="flex-1">
        {links.map((link) => (
          <Link
            className="me-4 flex items-center gap-4 rounded-e-full p-4 font-medium transition-all group-[[data-collapsed]]:mx-2 group-[[data-collapsed]]:gap-8 group-[[data-collapsed]]:rounded-full hover:bg-zinc-100 max-md:mx-2 max-md:gap-8 max-md:rounded-full dark:hover:bg-zinc-700"
            href={link.href}
            key={link.href}
          >
            <Icon className="size-8 shrink-0" icon={link.icon} ssr />

            <span className="-my-2 min-w-56">{link.title}</span>
          </Link>
        ))}
      </div>

      <div className="px-4">
        <button
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="ms-auto block cursor-pointer rounded-md border border-zinc-300 p-3 shadow max-md:hidden"
          onClick={toggleCollapse}
        >
          <Icon
            className="size-5"
            icon={isCollapsed ? iconExpand : iconCollapse}
            ssr
          />
        </button>
      </div>
    </nav>
  )
}
