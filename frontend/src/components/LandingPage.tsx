import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, Lock, Zap, ArrowRight, Play } from 'lucide-react'
import TrueFocus from './TrueFocus'
import ScrollReveal from './ScrollReveal'
import Squares from './Squares'

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Squares Background */}
      <Squares 
        direction="diagonal"
        speed={0.5}
        borderColor="rgba(59, 130, 246, 0.2)"
        squareSize={60}
        hoverFillColor="rgba(59, 130, 246, 0.1)"
      />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo and Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-block relative mb-6"
            >
              <Shield className="w-24 h-24 text-blue-400 mx-auto" />
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-50"
              />
            </motion.div>
          </motion.div>

          {/* Main Title with TrueFocus */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <TrueFocus 
              sentence="PitchGuard Lite"
              manualMode={false}
              blurAmount={5}
              borderColor="#3b82f6"
              animationDuration={2}
              pauseBetweenAnimations={3}
              className="mb-4"
            />
          </motion.div>

          {/* Subtitle with ScrollReveal */}
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            delay={0.5}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              When does a startup die? When it runs out of funding? No! When the market shifts? 
              No! When the team gives up? No! A startup dies when its pitch is forgotten! 
              <span className="text-gradient font-semibold"> Transform your pitch with AI-powered analysis.</span>
            </h2>
          </ScrollReveal>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: Lock, text: "Military-Grade Encryption", color: "bg-green-500/20 text-green-300" },
              { icon: Zap, text: "Real-Time AI Analysis", color: "bg-blue-500/20 text-blue-300" },
              { icon: Shield, text: "Zero Data Storage", color: "bg-purple-500/20 text-purple-300" },
              { icon: Sparkles, text: "Advanced Animations", color: "bg-yellow-500/20 text-yellow-300" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`glass-card px-6 py-3 flex items-center gap-3 ${feature.color} border border-white/20`}
              >
                <feature.icon className="w-5 h-5" />
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 neon-glow text-lg"
            >
              <Play className="w-6 h-6" />
              Start Analysis
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-8 py-4 text-white hover:text-white flex items-center gap-3 text-lg"
            >
              <Shield className="w-5 h-5" />
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "256-bit", label: "AES Encryption", icon: Lock },
              { number: "< 2s", label: "Analysis Time", icon: Zap },
              { number: "100%", label: "Privacy Guaranteed", icon: Shield },
            ].map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                delay={2.2 + index * 0.2}
                className="glass-card p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70">{stat.label}</div>
              </ScrollReveal>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              Why Choose PitchGuard?
            </h3>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience the future of pitch analysis with cutting-edge technology and uncompromising security.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced AI Analysis",
                description: "Multi-criteria scoring with contextual understanding trained on thousands of successful pitches.",
                icon: "🧠",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Military-Grade Security",
                description: "AES-256-GCM encryption ensures your pitch never exists unencrypted on our servers.",
                icon: "🔒",
                color: "from-green-500 to-blue-500"
              },
              {
                title: "Stunning Animations",
                description: "Framer Motion powered interface with particle effects and glass morphism design.",
                icon: "✨",
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "Real-Time Processing",
                description: "Get comprehensive analysis results in seconds with our optimized AI pipeline.",
                icon: "⚡",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Cryptographic Receipts",
                description: "SHA-256 hashes provide tamper-proof verification of your scoring sessions.",
                icon: "🧾",
                color: "from-indigo-500 to-purple-500"
              },
              {
                title: "Export & Share",
                description: "Generate professional PDF reports and share results with stakeholders.",
                icon: "📊",
                color: "from-pink-500 to-red-500"
              },
            ].map((feature, index) => (
              <ScrollReveal
                key={feature.title}
                delay={index * 0.1}
                className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="relative z-10 py-16 px-4">
        <ScrollReveal className="max-w-4xl mx-auto">
          <div className="glass-card p-8 border border-green-400/30 bg-green-500/10 text-center">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.6)",
                  "0 0 20px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block p-4 rounded-full bg-green-500/20 mb-6"
            >
              <Lock className="w-12 h-12 text-green-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-300 mb-4">
              Your Ideas Stay Yours
            </h3>
            <p className="text-green-200 text-lg leading-relaxed">
              With client-side encryption and zero plaintext storage, your pitch content never exists 
              unencrypted on our servers. We've built PitchGuard with privacy-by-design principles, 
              ensuring your innovative ideas remain completely confidential.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}

export default LandingPage
