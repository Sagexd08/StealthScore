import React from 'react'
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Shield, Lock } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  // If Clerk is not configured, show fallback authentication screen
  if (!clerkPubKey || clerkPubKey.includes('your_production_clerk_key_here') || clerkPubKey.includes('pk_live_your_production_clerk_key_here') || clerkPubKey.includes('your_clerk_publishable_key_here')) {
    console.warn('Clerk not configured - showing fallback authentication screen')
    return <AuthenticationScreen />
  }

  try {
    return (
      <ClerkProvider publishableKey={clerkPubKey}>
        <SignedIn>
          {/* Only render children when user is authenticated */}
          {children}
        </SignedIn>
        <SignedOut>
          {/* Show authentication screen when user is not signed in */}
          <AuthenticationScreen />
        </SignedOut>
      </ClerkProvider>
    )
  } catch (error) {
    console.error('Clerk error, falling back to public access:', error)
    return <>{children}</>
  }
}

const AuthenticationScreen: React.FC = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = clerkPubKey && !clerkPubKey.includes('your_production_clerk_key_here') && !clerkPubKey.includes('pk_live_your_production_clerk_key_here')

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden z-10 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-purple-900/40 backdrop-blur-sm" />

      {/* Subtle Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-2xl opacity-20"
            style={{
              width: Math.random() * 150 + 80,
              height: Math.random() * 150 + 80,
              background: `linear-gradient(45deg, ${
                ['#3b82f6', '#8b5cf6', '#06b6d4'][i]
              }, transparent)`,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="glass-card p-8 text-center">
          {/* Logo */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mb-6"
          >
            <Shield className="w-16 h-16 text-blue-400 mx-auto" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-white mb-3"
          >
            Sign In to Stealth Score
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/70 mb-6 text-sm md:text-base"
          >
            Authentication required to access privacy-preserving AI pitch analysis
          </motion.p>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 mb-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-green-300 font-medium text-sm">Secure Authentication</span>
            </div>
            <p className="text-green-200 text-xs">
              Your account is protected with enterprise-grade security
            </p>
          </motion.div>

          {/* Sign In Component or Configuration Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="w-full"
          >
            {isClerkConfigured ? (
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 w-full shadow-lg hover:shadow-xl",
                    card: "bg-transparent shadow-none border-none w-full",
                    rootBox: "w-full",
                    headerTitle: "text-white text-xl font-bold mb-3",
                    headerSubtitle: "text-white/80 text-sm mb-6",
                    socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-lg py-3 px-4 mb-3 w-full backdrop-blur-sm",
                    socialButtonsBlockButtonText: "text-white font-medium text-sm",
                    formFieldLabel: "text-white text-sm font-semibold mb-2",
                    formFieldInput: "bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300 w-full text-sm backdrop-blur-sm",
                    footerActionLink: "text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200",
                    dividerLine: "bg-white/30",
                    dividerText: "text-white/70 text-sm font-medium",
                    formFieldRow: "mb-5 w-full",
                    footer: "mt-6",
                    formFieldAction: "text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200",
                    identityPreviewText: "text-white/80 text-sm",
                    identityPreviewEditButton: "text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                  },
                  layout: {
                    socialButtonsPlacement: "top"
                  }
                }}
              />
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6 text-center">
                <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-yellow-300 font-semibold mb-2">Authentication Required</h3>
                <p className="text-yellow-200/80 text-sm mb-4">
                  This application requires authentication to access. Please configure Clerk authentication or contact the administrator.
                </p>
                <div className="text-xs text-yellow-200/60">
                  <p>Missing: VITE_CLERK_PUBLISHABLE_KEY</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-6 grid grid-cols-2 gap-3 text-xs text-white/70"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
              <span>Real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
              <span>Secure</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </div>
  )
}

export default AuthWrapper
