import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Sparkles, Brain, TrendingUp, Lock, Zap, Star, CheckCircle } from 'lucide-react'
import PitchForm from './components/PitchForm'
import ScoreDisplay from './components/ScoreDisplay'
import ParticleBackground from './components/ParticleBackground'
import FeatureCard from './components/FeatureCard'
import SecurityBadge from './components/SecurityBadge'
import { PitchGuardClient } from './lib/pitchguard-client'

function App() {
  const [scores, setScores] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [client] = useState(() => new PitchGuardClient())

  const handlePitchSubmit = async (pitchText) => {
    setIsLoading(true)
    setError(null)
    setScores(null)
    setReceipt(null)

    try {
      const result = await client.analyzePitch(pitchText)
      setScores(result.scores)
      setReceipt(result.receipt)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "AES-256-GCM encryption ensures your pitch never leaves your device unprotected",
      color: "blue"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced language models evaluate your pitch across multiple dimensions",
      color: "purple"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive scoring and feedback in seconds, not days",
      color: "yellow"
    },
    {
      icon: TrendingUp,
      title: "Actionable Insights",
      description: "Detailed metrics help you understand and improve your pitch",
      color: "green"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        {/* Header */}
        <header className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="mr-4"
              >
                <Shield className="w-12 h-12 text-blue-400" />
              </motion.div>
              <h1 className="text-6xl font-bold gradient-text">
                PitchGuard Lite
              </h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-4"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto"
            >
              Transform your startup pitch with AI-powered analysis. 
              <span className="text-blue-400 font-semibold"> Secure, instant, and actionable feedback</span> 
              to help you win over investors.
            </motion.p>

            <SecurityBadge />
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
            {/* Pitch Input Section */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <PitchForm 
                onSubmit={handlePitchSubmit}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <ScoreDisplay 
                scores={scores}
                receipt={receipt}
                isLoading={isLoading}
              />
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.section
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose PitchGuard?
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Built for founders who value both security and insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="glass rounded-2xl p-8 mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  className="text-4xl font-bold text-blue-400 mb-2"
                >
                  256-bit
                </motion.div>
                <p className="text-slate-300">Encryption Strength</p>
              </div>
              <div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-4xl font-bold text-green-400 mb-2"
                >
                  &lt;5s
                </motion.div>
                <p className="text-slate-300">Average Analysis Time</p>
              </div>
              <div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="text-4xl font-bold text-purple-400 mb-2"
                >
                  4
                </motion.div>
                <p className="text-slate-300">Scoring Dimensions</p>
              </div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Shield className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-slate-300">
                  PitchGuard Lite - Secure pitch analysis with client-side encryption
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center text-green-400"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Zero Data Retention</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center text-blue-400"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  <span className="text-sm">End-to-End Encrypted</span>
                </motion.div>
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  )
}

export default App