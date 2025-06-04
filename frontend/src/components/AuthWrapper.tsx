import React from 'react'
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Shield, Lock } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!clerkPubKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700">
        <div className="glass-card p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Configuration Required</h2>
          <p className="text-red-200">
            Please set your VITE_CLERK_PUBLISHABLE_KEY environment variable to enable authentication.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <AuthenticationScreen />
      </SignedOut>
    </ClerkProvider>
  )
}

const AuthenticationScreen: React.FC = () => {
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
            Welcome to PitchGuard
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/70 mb-6 text-sm md:text-base"
          >
            Secure your startup's future with AI-powered pitch analysis
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

          {/* Sign In Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="w-full"
          >
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 w-full",
                  card: "bg-transparent shadow-none border-none w-full",
                  rootBox: "w-full",
                  headerTitle: "text-white text-lg font-bold mb-2",
                  headerSubtitle: "text-white/70 text-sm mb-4",
                  socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-lg py-3 px-4 mb-3 w-full",
                  socialButtonsBlockButtonText: "text-white font-medium text-sm",
                  formFieldLabel: "text-white text-sm font-medium mb-2",
                  formFieldInput: "bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full text-sm",
                  footerActionLink: "text-blue-400 hover:text-blue-300 font-medium text-sm",
                  dividerLine: "bg-white/20",
                  dividerText: "text-white/60 text-sm",
                  formFieldRow: "mb-4 w-full",
                  footer: "mt-4",
                  formFieldAction: "text-blue-400 hover:text-blue-300 text-sm",
                  identityPreviewText: "text-white/70 text-sm",
                  identityPreviewEditButton: "text-blue-400 hover:text-blue-300 text-sm"
                },
                layout: {
                  socialButtonsPlacement: "top"
                }
              }}
            />
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
