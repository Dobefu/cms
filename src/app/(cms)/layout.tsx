import Sidebar from '@/components/layout/sidebar'
import { validateSession } from '@/utils/validate-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAnonymous } = await validateSession()

  if (isAnonymous) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  const isSidebarCollapsed = cookieStore.get('sidebar-collapsed')

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar isCollapsedInitial={isSidebarCollapsed?.value === 'true'} />

      <main
        className="flex flex-1 flex-col gap-4 overflow-auto rounded-s-xl bg-zinc-100 p-4 shadow-inner dark:bg-zinc-700"
        id="main-content"
      >
        {children}
      </main>
    </div>
  )
}
