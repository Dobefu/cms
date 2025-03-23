import Header from '@/components/layout/header'
import ToastContainer from '@/components/toast/toast-container.client'
import ToastProvider from '@/components/toast/toast-context.client'
import { cn } from '@/utils/cn'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './css/globals.css'

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
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'flex h-full flex-col text-gray-800 antialiased dark:bg-zinc-900 dark:text-white',
        )}
      >
        <ToastProvider>
          <Header />

          {children}

          <ToastContainer />
        </ToastProvider>

        <div id="modal-root" />
      </body>
    </html>
  )
}
