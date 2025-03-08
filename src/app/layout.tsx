import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export function generateMetadata(): Metadata {
  return {
    title: {
      default: 'CMS',
      template: `%s | CMS`,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="h-full" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col gap-4 bg-zinc-100 text-black antialiased dark:bg-zinc-900 dark:text-white`}
      >
        <Header />

        <main className="flex-1 px-4" id="main-content">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
