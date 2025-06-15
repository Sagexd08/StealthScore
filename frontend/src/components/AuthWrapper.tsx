import React from 'react'
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Shield, Lock, Sparkles, Chrome } from 'lucide-react'
import GoogleOneTap from './GoogleOneTap'
import ParticleBackground from './ParticleBackground'
import Squares from './Squares'
import ClickSpark from './ClickSpark'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!clerkPubKey || clerkPubKey.includes('your_production_clerk_key_here') || clerkPubKey.includes('pk_live_your_production_clerk_key_here') || clerkPubKey.includes('your_clerk_publishable_key_here')) {
    console.warn('Clerk not configured - showing fallback authentication screen')
    return <AuthenticationScreen />
  }

  try {
    return (
      <>
        <SignedIn>
          {children}
        </SignedIn>
        <SignedOut>
          <AuthenticationScreen />
        </SignedOut>
      </>
    )
  } catch (error) {
    console.error('Clerk error, showing authentication screen:', error)
    return <AuthenticationScreen />
  }
}

const AuthenticationScreen: React.FC = () => {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = clerkPubKey && !clerkPubKey.includes('your_production_clerk_key_here') && !clerkPubKey.includes('pk_live_your_production_clerk_key_here') && !clerkPubKey.includes('your_clerk_publishable_key_here')

  return (
    <ClickSpark>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden z-10 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 font-montserrat">
        {/* Background Elements */}
        <ParticleBackground />

        {/* Animated Square Background */}
        <Squares
          direction="diagonal"
          speed={0.1}
          borderColor="rgba(99, 102, 241, 0.1)"
          squareSize={60}
          hoverFillColor="rgba(99, 102, 241, 0.05)"
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-sm" />

        {/* Floating Orbs */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/30 rounded-full blur-2xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
          className="relative z-20 w-full max-w-md mx-auto"
        >
          {/* Enhanced Glassmorphism Container */}
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="relative group"
                >
                  {/* Animated Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-4 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  {/* Floating Sparkles */}
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3"
              >
                Welcome to Stealth Score
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-white/80 text-lg mb-2"
              >
                Secure authentication required
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center justify-center gap-2 text-white/60 text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Enterprise-grade security</span>
              </motion.div>
            </motion.div>

            {/* Google One Tap Integration */}
            {isClerkConfigured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mb-6"
              >
                <GoogleOneTap
                  showFallback={false}
                  onSuccess={() => console.log('Google One Tap success')}
                  onError={(error) => console.error('Google One Tap error:', error)}
                />
              </motion.div>
            )}

            {/* Main Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="w-full"
            >
              {isClerkConfigured ? (
                <SignIn
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 w-full shadow-lg hover:shadow-xl hover:scale-105",
                      card: "bg-transparent shadow-none border-none w-full",
                      rootBox: "w-full",
                      headerTitle: "text-white text-xl font-bold mb-3",
                      headerSubtitle: "text-white/80 text-sm mb-6",
                      socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-xl py-3 px-4 mb-3 w-full backdrop-blur-sm hover:scale-105",
                      socialButtonsBlockButtonText: "text-white font-medium",
                      formFieldInput: "bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl py-3 px-4 w-full backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300",
                      formFieldLabel: "text-white/90 font-medium mb-2 block",
                      footerActionLink: "text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200",
                      footerActionText: "text-white/70",
                      dividerLine: "bg-white/20",
                      dividerText: "text-white/60 bg-transparent px-4",
                      formHeaderTitle: "text-white text-xl font-bold mb-2",
                      formHeaderSubtitle: "text-white/80 text-sm mb-6",
                      identityPreviewEditButton: "text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                    },
                    layout: {
                      socialButtonsPlacement: "top"
                    }
                  }}
                />
              ) : (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-6 text-center backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", bounce: 0.5 }}
                  >
                    <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  </motion.div>
                  <h3 className="text-yellow-300 font-semibold mb-2">Authentication Required</h3>
                  <p className="text-yellow-200/80 text-sm mb-4">
                    This application requires authentication to access. Please configure Clerk authentication or contact the administrator.
                  </p>
                  <div className="text-xs text-yellow-200/60 bg-yellow-500/10 rounded-lg p-2">
                    <p>Missing: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Enhanced Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                <Chrome className="w-3 h-3" />
                <span>Powered by Clerk • SOC 2 Compliant</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ClickSpark>
  )
}

export default AuthWrapper
