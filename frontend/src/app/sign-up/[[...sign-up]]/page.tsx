'use client'

import { SignUp, useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft, Sparkles, Lock, Zap, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ParticleBackground from '../../../components/ParticleBackground'
import Squares from '../../../components/Squares'
import ClickSpark from '../../../components/ClickSpark'
import Floating3DBackground from '../../../components/Floating3DBackground'
import TrueFocus from '../../../components/TrueFocus'

export default function SignUpPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <ClickSpark>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden font-montserrat">
        <ParticleBackground />

        <Squares
          direction="diagonal"
          speed={0.15}
          borderColor="rgba(99, 102, 241, 0.1)"
          squareSize={60}
          hoverFillColor="rgba(99, 102, 241, 0.05)"
        />

        <Floating3DBackground>
          <div className="opacity-20" />
        </Floating3DBackground>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Enhanced Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
                className="flex items-center justify-center mb-6"
              >
                <div className="relative bg-gradient-to-r from-purple-500 via-pink-600 to-orange-500 p-4 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <Sparkles className="w-10 h-10 text-white relative z-10" />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-white/20 rounded-2xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-4"
              >
                <TrueFocus
                  sentence="Join Stealth Score"
                  manualMode={false}
                  blurAmount={3}
                  borderColor="#a855f7"
                  animationDuration={4}
                  pauseBetweenAnimations={8}
                  className="text-3xl font-bold text-white mb-2"
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
              >
                Privacy-Preserving AI Platform
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-white/70 text-base mb-4"
              >
                Create your account and start analyzing pitches with military-grade encryption
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center justify-center gap-3 flex-wrap"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-green-300 text-xs font-medium">Zero-Knowledge</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                  <Star className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-300 text-xs font-medium">Premium Features</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300 text-xs font-medium">Instant Results</span>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Sign Up Component */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.2 }}
              className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden glass-card"
            >
              <Floating3DBackground>
                <div className="opacity-10" />
              </Floating3DBackground>

              <div className="relative z-10">
                <SignUp
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 w-full shadow-lg hover:shadow-xl hover:scale-105 transform font-montserrat",
                      card: "bg-transparent shadow-none border-none w-full",
                      rootBox: "w-full",
                      headerTitle: "text-white text-xl font-bold mb-3 font-montserrat",
                      headerSubtitle: "text-white/80 text-sm mb-6 font-montserrat",
                      socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 rounded-xl py-4 px-4 mb-3 w-full backdrop-blur-sm font-montserrat",
                      socialButtonsBlockButtonText: "text-white font-medium",
                      formFieldInput: "bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-4 w-full backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 font-montserrat",
                      formFieldLabel: "text-white/90 font-medium mb-2 block font-montserrat",
                      footerActionText: "text-white/70 font-montserrat",
                      footerActionLink: "text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 font-montserrat",
                      identityPreviewText: "text-white/80 font-montserrat",
                      identityPreviewEditButton: "text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200 font-montserrat",
                      dividerLine: "bg-white/20",
                      dividerText: "text-white/60 font-montserrat"
                    },
                    layout: {
                      socialButtonsPlacement: "top"
                    }
                  }}
                  redirectUrl="/"
                />
              </div>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-center mt-6"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ClickSpark>
  )
}
