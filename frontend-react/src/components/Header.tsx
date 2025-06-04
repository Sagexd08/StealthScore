import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, Lock, Zap } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center py-12 relative"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Logo and Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative"
          >
            <Shield className="w-12 h-12 text-blue-400" />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-6xl font-bold text-gradient"
          >
            PitchGuard
          </motion.h1>
          
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
        >
          Advanced AI-powered pitch analysis with{' '}
          <span className="text-gradient font-semibold">military-grade encryption</span>
        </motion.p>
        
        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {[
            { icon: Lock, text: "Client-Side Encryption", color: "bg-green-500/20 text-green-300" },
            { icon: Zap, text: "Real-Time Analysis", color: "bg-blue-500/20 text-blue-300" },
            { icon: Shield, text: "Zero Data Storage", color: "bg-purple-500/20 text-purple-300" },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`glass-card px-4 py-2 flex items-center gap-2 ${feature.color} border border-white/20`}
            >
              <feature.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="glass-card max-w-md mx-auto p-4 border border-green-400/30 bg-green-500/10"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 10px rgba(34, 197, 94, 0.5)",
                  "0 0 20px rgba(34, 197, 94, 0.8)",
                  "0 0 10px rgba(34, 197, 94, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 rounded-full bg-green-500/20"
            >
              <Lock className="w-5 h-5 text-green-400" />
            </motion.div>
            <div className="text-left">
              <p className="text-green-300 font-medium text-sm">
                🔒 Your pitch is encrypted before leaving your device
              </p>
              <p className="text-green-400/70 text-xs mt-1">
                Zero plaintext storage • Complete privacy guaranteed
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header
