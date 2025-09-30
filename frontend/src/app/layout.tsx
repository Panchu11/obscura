import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Obscura - Computing in the Shadows',
  description: 'A Decentralized Marketplace for Fully Homomorphic Encrypted Computation',
  keywords: ['FHE', 'FHEVM', 'Zama', 'Privacy', 'Encryption', 'Blockchain'],
  authors: [{ name: 'Obscura Team' }],
  openGraph: {
    title: 'Obscura - Computing in the Shadows',
    description: 'Privacy-preserving compute marketplace powered by Zama FHEVM',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-obscura-darker text-white font-sans">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #2a2a2a',
              },
              success: {
                iconTheme: {
                  primary: '#8b5cf6',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

