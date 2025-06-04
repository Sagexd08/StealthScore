import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Shield, Sparkles } from 'lucide-react'

const LoadingAnimation: React.FC = () => {
  const steps = [
    { icon: Shield, text: "Encrypting your pitch...", color: "text-green-400" },
    { icon: Zap, text: "Sending to AI analysis...", color: "text-blue-400" },
    { icon: Brain, text: "AI is analyzing your pitch...", color: "text-purple-400" },
    { icon: Sparkles, text: "Generating insights...", color: "text-yellow-400" },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Main Loading Circle */}
      <motion.div
        className="relative mb-12"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Outer Ring */}
        <motion.div
          className="w-32 h-32 border-4 border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className="absolute inset-4 border-4 border-blue-400/50 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 4, repeat: Infinity, ease: "linear" }
          }}
        >
          <Brain className="w-12 h-12 text-purple-400" />
        </motion.div>
        
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Loading Steps */}
      <div className="space-y-6 max-w-md">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: [0, 1, 1, 0.3],
              x: 0
            }}
            transition={{ 
              delay: index * 1.5,
              duration: 1.5,
              times: [0, 0.2, 0.8, 1]
            }}
            className="flex items-center gap-4 glass-card p-4"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className={`p-2 rounded-full bg-white/10 ${step.color}`}
            >
              <step.icon className="w-5 h-5" />
            </motion.div>
            
            <div className="text-left">
              <motion.p
                className={`font-medium ${step.color}`}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {step.text}
              </motion.p>
              
              {/* Progress Dots */}
              <div className="flex gap-1 mt-2">
                {[...Array(3)].map((_, dotIndex) => (
                  <motion.div
                    key={dotIndex}
                    className="w-1 h-1 bg-white/50 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      delay: dotIndex * 0.2,
                      duration: 1,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </div>

      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="mt-8 text-white/70"
      >
        <p className="text-lg font-medium mb-2">AI Analysis in Progress</p>
        <p className="text-sm">
          This may take a few moments while our AI evaluates your pitch...
        </p>
      </motion.div>
    </div>
  )
}

export default LoadingAnimation
