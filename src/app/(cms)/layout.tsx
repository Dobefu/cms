import Sidebar from '@/components/layout/sidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-1">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-4 px-4" id="main-content">
        {children}
      </main>
    </div>
  )
}
