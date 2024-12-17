"use client"

import "@/app/globals.css"
import { TransactionProvider } from '@/contexts/TransactionContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background">
        <TransactionProvider>
          {children}
        </TransactionProvider>
      </body>
    </html>
  )
}
