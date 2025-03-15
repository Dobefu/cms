import iconContent from '@iconify/icons-mdi/document'
import iconContentTypes from '@iconify/icons-mdi/flowchart'
import iconDashboard from '@iconify/icons-mdi/view-dashboard'
import { type IconifyIcon } from '@iconify/react/dist/iconify.js'
import Client from './sidebar.client'

export type Props = Readonly<{
  isCollapsedInitial: boolean
}>

export default async function Sidebar({ isCollapsedInitial }: Props) {
  const links: { title: string; href: string; icon: IconifyIcon | string }[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: iconDashboard,
    },
    {
      title: 'Content',
      href: '/content',
      icon: iconContent,
    },
    {
      title: 'Content Types',
      href: '/content-types',
      icon: iconContentTypes,
    },
  ]

  return <Client isCollapsedInitial={isCollapsedInitial} links={links} />
}
