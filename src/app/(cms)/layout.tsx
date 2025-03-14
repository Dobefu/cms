export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex flex-1 flex-col gap-4 px-4" id="main-content">
      {children}
    </main>
  )
}
