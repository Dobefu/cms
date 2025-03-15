import Footer from '@/components/layout/footer'
import { validateSession } from '@/utils/validate-session'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAnonymous } = await validateSession()

  if (!isAnonymous) {
    redirect('/dashboard')
  }

  return (
    <>
      <main
        className="flex flex-1 flex-col gap-4 bg-zinc-100 p-4 shadow-inner dark:bg-zinc-700"
        id="main-content"
      >
        {children}
      </main>

      <Footer />
    </>
  )
}
