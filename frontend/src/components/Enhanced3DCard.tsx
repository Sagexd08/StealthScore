import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Floating3DBackground from './Floating3DBackground';
import ClickSpark from './ClickSpark';

interface Enhanced3DCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  rotateIntensity?: number;
  glowColor?: string;
  borderGradient?: string;
  backgroundOpacity?: number;
  enableSpark?: boolean;
  enable3DBackground?: boolean;
  cornerAccents?: boolean;
  floatingElements?: boolean;
}

const Enhanced3DCard: React.FC<Enhanced3DCardProps> = ({
  children,
  className = '',
  hoverScale = 1.05,
  rotateIntensity = 6,
  glowColor = 'indigo-500',
  borderGradient = 'from-indigo-400 via-purple-400 to-pink-400',
  backgroundOpacity = 0.25,
  enableSpark = true,
  enable3DBackground = true,
  cornerAccents = true,
  floatingElements = true
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      whileHover={{ 
        scale: hoverScale, 
        rotateY: rotateIntensity,
        rotateX: rotateIntensity / 2
      }}
      transition={{ 
        duration: 0.5, 
        type: "spring", 
        bounce: 0.3 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        glass-card relative overflow-hidden cursor-pointer transform-gpu perspective-1000
        border border-white/10 hover:border-${glowColor}/40 transition-all duration-500
        hover:shadow-2xl hover:shadow-${glowColor}/30
        ${className}
      `}
    >
      {}
      {enable3DBackground && (
        <>
          <Floating3DBackground>
            <div style={{ opacity: backgroundOpacity }} />
          </Floating3DBackground>
          
          {}
          <div className="absolute inset-0" style={{ opacity: backgroundOpacity * 0.6 }}>
            <Floating3DBackground>
              <div style={{ opacity: 0.7 }} />
            </Floating3DBackground>
          </div>
        </>
      )}

      {}
      {floatingElements && (
        <>
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`absolute top-4 right-4 w-8 h-8 border border-${glowColor}/30 rounded-lg backdrop-blur-sm`}
          />
          
          <motion.div
            animate={{
              rotate: [0, -360],
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.3, 0.08]
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
              opacity: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            className={`absolute bottom-4 left-4 w-6 h-6 border border-purple-400/25 rounded-full backdrop-blur-sm`}
          />
        </>
      )}

      {}
      <div className="relative z-10">
        {children}
      </div>

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 bg-gradient-to-br from-${glowColor}/8 via-purple-500/8 to-pink-500/8 rounded-2xl`}
      />

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-2xl"
      >
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${borderGradient} opacity-25 blur-sm`}></div>
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${borderGradient} opacity-15 blur-md scale-105`}></div>
      </motion.div>

      {}
      {cornerAccents && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-${glowColor} to-purple-500 rounded-full animate-pulse`}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`absolute bottom-3 left-3 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse`}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className={`absolute top-1/2 right-3 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse`}
          />
        </>
      )}

      {}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1.2 : 0.8
        }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 bg-gradient-to-r from-${glowColor}/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl`}
      />
    </motion.div>
  );

  return enableSpark ? (
    <ClickSpark>
      {cardContent}
    </ClickSpark>
  ) : cardContent;
};

export default Enhanced3DCard;
