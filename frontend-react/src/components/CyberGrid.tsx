import React from 'react'
import { motion } from 'framer-motion'

const CyberGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Main Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 cyber-grid"
      />
      
      {/* Animated Grid Lines */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {/* Horizontal scanning lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
            style={{ top: `${20 + i * 15}%` }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              delay: i * 2,
              repeat: Infinity,
              repeatDelay: 10,
            }}
          />
        ))}
        
        {/* Vertical scanning lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"
            style={{ left: `${25 + i * 25}%` }}
            animate={{
              y: ['-100%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6,
              delay: i * 3 + 5,
              repeat: Infinity,
              repeatDelay: 15,
            }}
          />
        ))}
      </motion.div>
      
      {/* Corner Brackets */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-blue-400/50"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-blue-400/50"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-blue-400/50"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-blue-400/50"
      />
      
      {/* Pulsing Dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      ))}
    </div>
  )
}

export default CyberGrid
