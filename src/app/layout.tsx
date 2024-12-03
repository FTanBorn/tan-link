'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Header from '@/components/layout/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideHeader = /^\/[^\/]+\/?$/.test(pathname)

  return (
    <html lang='en'>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {!hideHeader && <Header />}
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
