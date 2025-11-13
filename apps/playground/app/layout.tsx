import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeonPay Elements - Integración de Pagos Fácil y Segura | México',
  description: 'Integra pagos en tu ecommerce con DeonPay Elements. Componentes pre-construidos, PCI-compliant, multi-adquirente. Acepta tarjetas de crédito y débito en México de forma segura.',
  keywords: [
    'pagos mexico',
    'payment gateway',
    'elementos de pago',
    'checkout',
    'tarjetas',
    'pasarela de pagos',
    'ecommerce mexico',
    'pci compliant',
    'cybersource',
    'procesar pagos',
    'sdk pagos',
    'deonpay'
  ],
  authors: [{ name: 'DeonPay' }],
  creator: 'DeonPay',
  publisher: 'DeonPay',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://elements.deonpay.mx/',
    title: 'DeonPay Elements - Integración de Pagos en Minutos',
    description: 'Componentes de pago pre-construidos, seguros y personalizables. PCI-compliant desde el primer momento.',
    siteName: 'DeonPay Elements',
    images: [
      {
        url: 'https://elements.deonpay.mx/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DeonPay Elements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeonPay Elements - Integración de Pagos Fácil y Segura',
    description: 'Integra pagos en minutos con componentes pre-construidos y seguros',
    images: ['https://elements.deonpay.mx/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://api.deonpay.mx" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
