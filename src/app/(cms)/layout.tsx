import Sidebar from '@/components/layout/sidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-1">
      <Sidebar />

      <main
        className="flex flex-1 flex-col gap-4 rounded-s-xl bg-zinc-100 p-4 shadow-inner dark:bg-zinc-800"
        id="main-content"
      >
        {children}
      </main>
    </div>
  )
}
