import React from 'react';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import AuthWrapper from '../components/AuthWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Stealth Score - Privacy-Preserving AI Pitch Analysis',
  description: 'Revolutionary AI-powered pitch analysis with military-grade AES-256 encryption. Get real-time feedback and insights while maintaining complete privacy.',
  keywords: 'pitch analysis, AI, privacy, encryption, startup, funding, investor, pitch deck',
  authors: [{ name: 'Stealth Score Team' }],
  creator: 'Stealth Score',
  publisher: 'Stealth Score',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pitchguard-2e687.web.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Stealth Score - Privacy-Preserving AI Pitch Analysis',
    description: 'Revolutionary AI-powered pitch analysis with military-grade AES-256 encryption.',
    url: 'https://pitchguard-2e687.web.app',
    siteName: 'Stealth Score',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stealth Score - Privacy-Preserving AI Pitch Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stealth Score - Privacy-Preserving AI Pitch Analysis',
    description: 'Revolutionary AI-powered pitch analysis with military-grade AES-256 encryption.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#6366f1',
          colorBackground: 'rgba(15, 23, 42, 0.95)',
          colorInputBackground: 'rgba(255, 255, 255, 0.05)',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '1rem',
          fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
          fontSize: '0.875rem',
          spacingUnit: '1rem',
        },
        elements: {
          card: 'bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl glass-card',
          headerTitle: 'text-white font-bold text-xl font-montserrat',
          headerSubtitle: 'text-white/80 font-montserrat',
          formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-montserrat rounded-xl py-4',
          formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-blue-400/25 backdrop-blur-sm font-montserrat rounded-xl',
          formFieldLabel: 'text-white/90 font-medium font-montserrat',
          dividerLine: 'bg-white/20',
          dividerText: 'text-white/60 font-montserrat',
          socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm font-montserrat rounded-xl',
          footerActionLink: 'text-blue-400 hover:text-blue-300 transition-colors duration-200 font-montserrat',
          footerActionText: 'text-white/70 font-montserrat',
          identityPreviewText: 'text-white/80 font-montserrat',
          identityPreviewEditButton: 'text-blue-400 hover:text-blue-300 font-montserrat',
        },
      }}
    >
      <html lang="en" className={`${montserrat.variable}`}>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#6366f1" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </head>
        <body className={`${inter.className} font-montserrat antialiased bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 min-h-screen`}>
          <AuthWrapper>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#fff',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
                },
              }}
            />
          </AuthWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
