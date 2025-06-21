'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Chrome, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface GoogleOneTapProps {
  className?: string
  showFallback?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
  autoPrompt?: boolean
}

export default function GoogleOneTap({
  className = '',
  showFallback = true,
  onSuccess,
  onError,
  autoPrompt = true
}: GoogleOneTapProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleAuthSuccess = () => {
    setAuthStatus('success')
    toast.success('🎉 Successfully signed in with Google!', {
      duration: 4000,
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
      },
    })
    onSuccess?.()
  }

  const handleAuthError = (error: string) => {
    setAuthStatus('error')
    toast.error('Failed to sign in with Google. Please try again.', {
      style: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
      },
    })
    onError?.(error)
    setTimeout(() => setAuthStatus('idle'), 3000)
  }

  return (
    <div className={`relative font-montserrat ${className}`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="relative group"
          >
            {/* Enhanced Glassmorphism Container */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/30 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 glass-card">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Floating Sparkles */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>

              <div className="relative z-10 p-6">
                {/* Clerk Google One Tap */}
                <div className="mb-4">
                  <ClerkGoogleOneTap />
                </div>

                {/* Status Indicator */}
                <AnimatePresence>
                  {authStatus !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2 text-sm"
                    >
                      {authStatus === 'loading' && (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
                          <span className="text-blue-300">Signing in...</span>
                        </>
                      )}
                      {authStatus === 'success' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-300">Success!</span>
                        </>
                      )}
                      {authStatus === 'error' && (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-300">Please try again</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Security Badge */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-300 backdrop-blur-sm">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Fallback UI */}
      {showFallback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm mx-auto"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center justify-center mb-4"
            >
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full shadow-lg">
                <Chrome className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg font-semibold text-white mb-2"
            >
              Quick Sign In
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-white/70 text-sm mb-4"
            >
              Google One Tap will appear automatically when available
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center justify-center gap-2 text-xs text-white/50"
            >
              <Shield className="w-3 h-3" />
              <span>Secure authentication with Google</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Example usage component for demonstration
export function GoogleOneTapDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Google One Tap Demo
          </h1>
          <p className="text-white/70">
            Experience seamless authentication
          </p>
        </motion.div>
        
        <GoogleOneTap showFallback={true} />
      </div>
    </div>
  )
}
