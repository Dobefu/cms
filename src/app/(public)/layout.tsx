import Footer from '@/components/layout/footer'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
