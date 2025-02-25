import { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Header from '@/components/layout/Header'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    default: 'TanLink - One Link, Endless Possibilities',
    template: '%s | TanLink'
  },
  description: 'Combine all your social profiles, websites, and landing pages into a single, easy-to-share link.',
  applicationName: 'TanLink',
  keywords: [
    'link management',
    'social links',
    'digital business card',
    'personal branding',
    'profile sharing',
    'social media links'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tanlink.me',
    siteName: 'TanLink',
    title: 'TanLink - One Link, Endless Possibilities',
    description: 'Combine all your social profiles, websites, and landing pages into a single, easy-to-share link.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TanLink - One Link, Endless Possibilities',
    description: 'Combine all your social profiles, websites, and landing pages into a single, easy-to-share link.',
    creator: '@tanlink'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png'
  },
  alternates: {
    canonical: 'https://tanlink.me'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#2563EB' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />

        {/* Webfont optimizations */}
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
