import type { Metadata } from 'next'
import './globals.css'
import React from 'react'

export const metadata: Metadata = {
  title: 'SketchForge',
  description:
    'A fast, modern Excalidraw-style sketching app built with Next.js.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="min-h-full bg-background text-foreground">
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
