import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Linus Torvalds Code Review',
  description: 'Get your pull request brutally reviewed by Linus Torvalds',
  generator: 'Linus Code Review',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
    )
  }
