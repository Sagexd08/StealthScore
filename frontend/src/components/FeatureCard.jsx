import React from 'react'
import { motion } from 'framer-motion'

const FeatureCard = ({ icon: Icon, title, description, color }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400'
    }
    return colors[color] || colors.blue
  }

  const getGlowClass = (color) => {
    const glows = {
      blue: 'glow-blue',
      purple: 'glow-purple', 
      yellow: 'glow-yellow',
      green: 'glow-green'
    }
    return glows[color] || glows.blue
  }

  return (
    <motion.div
      className={`relative p-6 rounded-xl border bg-gradient-to-br ${getColorClasses(color)} 
                  hover-lift transition-all duration-300 group cursor-pointer`}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getGlowClass(color)}`}
        style={{ filter: 'blur(20px)', zIndex: -1 }}
      />

      {/* Icon */}
      <motion.div
        className="mb-4"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className={`w-8 h-8 ${getColorClasses(color).split(' ')[3]}`} />
      </motion.div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/20"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400 }}
      />

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent"
        style={{
          background: `linear-gradient(45deg, transparent, ${color === 'blue' ? '#3b82f6' : 
                                                           color === 'purple' ? '#8b5cf6' :
                                                           color === 'yellow' ? '#eab308' : '#10b981'}/30, transparent)`,
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.div>
  )
}

export default FeatureCard