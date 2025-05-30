'use client'

import iconCollapse from '@iconify/icons-mdi/arrow-collapse-left'
import iconExpand from '@iconify/icons-mdi/arrow-expand-right'
import { Icon, type IconifyIcon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { useCallback, useState } from 'react'

export type Props = Readonly<{
  isCollapsedInitial: boolean
  links: { title: string; href: string; icon: IconifyIcon | string }[]
}>

export default function Sidebar({ isCollapsedInitial, links }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedInitial)

  const toggleCollapse = useCallback(() => {
    const date = new Date()
    date.setTime(date.getTime() + 30 * 86400000) // 30 days.

    document.cookie = `sidebar-collapsed=${!isCollapsed}; expires=${date.toUTCString()}; path=/`
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed])

  return (
    <nav
      aria-label="Sidebar"
      className="group flex w-xs flex-col py-4 transition-all data-[collapsed]:w-20 max-lg:w-20"
      data-collapsed={isCollapsed ? true : null}
    >
      <div className="flex-1">
        {links.map((link) => (
          <Link
            className="me-4 flex items-center gap-4 rounded-e-full p-4 font-medium transition-all group-[[data-collapsed]]:mx-2 group-[[data-collapsed]]:gap-8 group-[[data-collapsed]]:rounded-full hover:bg-zinc-100 max-lg:mx-2 max-lg:gap-8 max-lg:rounded-full dark:hover:bg-zinc-700"
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
          className="btn ms-auto p-3 max-lg:hidden"
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
