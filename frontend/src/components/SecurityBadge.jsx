import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react'

const SecurityBadge = () => {
  const securityFeatures = [
    { icon: Lock, text: "AES-256 Encryption" },
    { icon: Eye, text: "Zero Data Retention" },
    { icon: CheckCircle, text: "Client-Side Processing" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="inline-flex items-center space-x-4 bg-green-500/10 border border-green-500/20 
                 rounded-full px-6 py-3 backdrop-blur-sm"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Shield className="w-5 h-5 text-green-400" />
      </motion.div>
      
      <div className="flex items-center space-x-3">
        {securityFeatures.map((feature, index) => (
          <motion.div
            key={feature.text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="flex items-center space-x-1"
          >
            <feature.icon className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-300 font-medium">
              {feature.text}
            </span>
            {index < securityFeatures.length - 1 && (
              <div className="w-1 h-1 bg-green-400/50 rounded-full ml-2" />
            )}
          </motion.div>
        ))}
      </div>

      {}
      <motion.div
        className="absolute inset-0 rounded-full border border-green-400/30"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

export default SecurityBadge
