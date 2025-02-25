'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Header from '@/components/layout/Header'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideHeader = /^\/[^\/]+\/?$|^\/dashboard(\/.*)?\/?$/.test(pathname)

  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <meta name='theme-color' content='#2563EB' />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {!hideHeader && <Header />}
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
