import Sidebar from '@/components/layout/sidebar'
import { validateSession } from '@/utils/validate-session'
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

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />

      <main
        className="flex flex-1 flex-col gap-4 overflow-auto rounded-s-xl bg-zinc-100 p-4 shadow-inner dark:bg-zinc-700"
        id="main-content"
      >
        {children}
      </main>
    </div>
  )
}
