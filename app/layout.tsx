import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Care Idosos - Apoio e Emergência',
  description: 'Aplicativo de emergência e apoio para idosos com recursos de SOS, lembretes de medicação e agendamento de consultas.',
  authors: [{ name: 'Care Idosos' }],
  openGraph: {
    title: 'Care Idosos - Apoio e Emergência',
    description: 'Aplicativo de emergência e apoio para idosos com recursos de SOS, lembretes de medicação e agendamento de consultas.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 