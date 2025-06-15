'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface AuthWrapperProps {
  children: React.ReactNode
}

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-lg">Loading Stealth Score...</p>
      <p className="text-sm text-white/60 mt-2">Initializing secure environment</p>
    </div>
  </div>
)

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading during SSR/hydration
  if (!isClient || !isLoaded) {
    return <LoadingSpinner />
  }

  return (
    <>
      <SignedIn>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl",
              }
            }}
            redirectUrl="/"
            signUpUrl="/sign-up"
          />
        </div>
      </SignedOut>
    </>
  )
}

export default AuthWrapper
