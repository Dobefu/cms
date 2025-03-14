export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main
      className="flex flex-1 flex-col gap-4 bg-zinc-100 p-4 shadow-inner dark:bg-zinc-800"
      id="main-content"
    >
      {children}
    </main>
  )
}
