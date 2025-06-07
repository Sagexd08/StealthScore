import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedVisualEffectsProps {
  children: React.ReactNode;
  variant?: 'default' | 'hero' | 'section' | 'card';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const EnhancedVisualEffects: React.FC<EnhancedVisualEffectsProps> = ({
  children,
  variant = 'default',
  intensity = 'medium',
  className = ''
}) => {
  const getEffectConfig = () => {
    const configs = {
      default: {
        orbCount: 3,
        orbSizes: ['w-32 h-32', 'w-40 h-40', 'w-36 h-36'],
        geometricCount: 2
      },
      hero: {
        orbCount: 6,
        orbSizes: ['w-96 h-96', 'w-[500px] h-[500px]', 'w-80 h-80', 'w-96 h-96', 'w-64 h-64', 'w-72 h-72'],
        geometricCount: 4
      },
      section: {
        orbCount: 4,
        orbSizes: ['w-64 h-64', 'w-80 h-80', 'w-56 h-56', 'w-72 h-72'],
        geometricCount: 3
      },
      card: {
        orbCount: 2,
        orbSizes: ['w-24 h-24', 'w-32 h-32'],
        geometricCount: 2
      }
    };
    return configs[variant];
  };

  const getIntensityOpacity = () => {
    const opacities = {
      low: { primary: 0.05, secondary: 0.03, geometric: 0.1 },
      medium: { primary: 0.1, secondary: 0.06, geometric: 0.15 },
      high: { primary: 0.15, secondary: 0.1, geometric: 0.2 }
    };
    return opacities[intensity];
  };

  const config = getEffectConfig();
  const opacity = getIntensityOpacity();

  const gradients = [
    'from-indigo-500/20 to-purple-600/20',
    'from-purple-500/20 to-pink-500/20',
    'from-blue-500/15 to-indigo-500/15',
    'from-cyan-500/15 to-blue-500/15',
    'from-emerald-500/10 to-teal-500/10',
    'from-rose-500/10 to-orange-500/10',
    'from-yellow-500/12 to-amber-500/12',
    'from-violet-500/12 to-purple-500/12'
  ];

  const positions = [
    'top-20 left-20',
    'bottom-20 right-20',
    'top-1/2 left-1/4',
    'bottom-1/4 right-1/4',
    'top-1/4 right-1/3',
    'bottom-1/2 left-1/2',
    'top-10 right-10',
    'bottom-10 left-10'
  ];

  return (
    <div className={`relative ${className}`}>
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {}
        {Array.from({ length: config.orbCount }).map((_, index) => (
          <motion.div
            key={`orb-${index}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [opacity.primary, opacity.primary * 1.5, opacity.primary]
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 2
            }}
            className={`absolute ${config.orbSizes[index] || 'w-64 h-64'} ${positions[index] || 'top-20 left-20'} bg-gradient-to-r ${gradients[index] || gradients[0]} rounded-full blur-3xl animate-pulse`}
            style={{ animationDelay: `${index * 2}s` }}
          />
        ))}

        {}
        {Array.from({ length: config.geometricCount }).map((_, index) => (
          <motion.div
            key={`geometric-${index}`}
            animate={{
              rotate: index % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1],
              opacity: [opacity.geometric, opacity.geometric * 2, opacity.geometric]
            }}
            transition={{
              rotate: { duration: 20 + index * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 4 + index, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3 + index, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`absolute ${positions[index + 2] || 'top-1/4 left-1/3'} ${
              index % 2 === 0 ? 'w-32 h-32 border border-indigo-400/20 rounded-lg' : 'w-24 h-24 border border-purple-400/20 rounded-full'
            } backdrop-blur-sm`}
          />
        ))}

        {}
        {intensity === 'high' && (
          <>
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/3 left-10 w-40 h-40 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                opacity: [0.08, 0.25, 0.08]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
              className="absolute bottom-1/3 right-10 w-44 h-44 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-xl"
            />
          </>
        )}
      </div>

      {}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default EnhancedVisualEffects;
