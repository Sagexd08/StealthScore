'use client'

import React, { Suspense } from 'react';
import { Inter, Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

// Metadata removed for client component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={`${montserrat.variable}`}>
        <head>
          <title>Stealth Score - Privacy-Preserving AI Pitch Analysis</title>
          <meta name="description" content="Revolutionary AI-powered pitch analysis with military-grade AES-256 encryption. Get real-time feedback and insights while maintaining complete privacy." />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#6366f1" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </head>
        <body className={`${inter.className} font-montserrat antialiased bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 min-h-screen`}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#fff',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(10px)',
                fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
              },
            }}
          />
        </body>
      </html>
  );
}
