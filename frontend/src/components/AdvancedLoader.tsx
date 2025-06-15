'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Zap, Brain, Target } from 'lucide-react';

interface AdvancedLoaderProps {
  message?: string;
  type?: 'default' | 'dots' | 'pulse' | 'spin' | 'brain' | 'sparkles';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AdvancedLoader: React.FC<AdvancedLoaderProps> = ({
  message = 'Loading...',
  type = 'default',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerSizeClasses = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg'
  };

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-gradient-to-r from-purple-400 to-pink-400 rounded-full`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );

      case 'brain':
        return (
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Brain className={`${sizeClasses[size]} text-blue-400`} />
          </motion.div>
        );

      case 'sparkles':
        return (
          <motion.div
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className={`${sizeClasses[size]} text-yellow-400`} />
          </motion.div>
        );

      case 'spin':
        return (
          <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin`} />
        );

      default:
        return (
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className={`${sizeClasses[size]} border-2 border-blue-400/30 border-t-blue-400 rounded-full`} />
            <motion.div
              className="absolute inset-0 border-2 border-transparent border-r-cyan-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center justify-center ${containerSizeClasses[size]} ${className}`}
    >
      {renderLoader()}
      {message && (
        <motion.span
          className="text-white/80 font-medium"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.span>
      )}
    </motion.div>
  );
};

export default AdvancedLoader;
