import React from 'react'
import { motion } from 'framer-motion'

const FloatingOrbs: React.FC = () => {
  const orbs = [
    {
      size: 'w-32 h-32',
      color: 'bg-blue-400/30',
      position: 'top-10 left-10',
      delay: 0,
      duration: 6,
    },
    {
      size: 'w-24 h-24',
      color: 'bg-purple-400/30',
      position: 'top-1/3 right-20',
      delay: 2,
      duration: 8,
    },
    {
      size: 'w-40 h-40',
      color: 'bg-pink-400/30',
      position: 'bottom-20 left-1/4',
      delay: 4,
      duration: 7,
    },
    {
      size: 'w-20 h-20',
      color: 'bg-cyan-400/30',
      position: 'bottom-1/3 right-1/3',
      delay: 1,
      duration: 5,
    },
    {
      size: 'w-36 h-36',
      color: 'bg-yellow-400/30',
      position: 'top-1/2 left-1/2',
      delay: 3,
      duration: 9,
    },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.size} ${orb.color} ${orb.position} rounded-full blur-xl`}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Additional animated elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-300 rounded-full"
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
      
      <motion.div
        className="absolute top-3/4 left-1/5 w-3 h-3 bg-purple-300 rounded-full"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
    </div>
  )
}

export default FloatingOrbs
