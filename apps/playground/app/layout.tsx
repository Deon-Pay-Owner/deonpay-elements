import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeonPay Elements Playground',
  description: 'Interactive demo of DeonPay Elements SDK',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
