import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Birdie for Good | Golf Charity Subscription Platform',
  description: 'Join a community of golfers making a difference. Subscribe, play, log scores, and support charities while winning exclusive rewards.',
  keywords: ['golf', 'charity', 'subscription', 'rewards', 'community', 'giving back'],
  authors: [{ name: 'Birdie for Good' }],
  openGraph: {
    title: 'Birdie for Good | Golf Charity Subscription Platform',
    description: 'Join a community of golfers making a difference. Subscribe, play, log scores, and support charities while winning exclusive rewards.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f3f0' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1816' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
