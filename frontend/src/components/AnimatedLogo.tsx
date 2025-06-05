import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Shield, Lock, Zap } from 'lucide-react';

interface AnimatedLogoProps {
  size?: number;
  variant?: 'shield' | 'lock' | 'zap' | 'custom';
  color?: string;
  animated?: boolean;
  className?: string;
  glowEffect?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 64,
  variant = 'shield',
  color = '#3b82f6',
  animated = true,
  className = '',
  glowEffect = true
}) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!animated || !logoRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    // Continuous rotation
    tl.to(logoRef.current, {
      rotation: 360,
      duration: 20,
      ease: 'none'
    });

    // Pulsing effect
    gsap.to(logoRef.current, {
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Path animation for custom SVG
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });
      
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 3,
        repeat: -1,
        ease: 'power2.inOut'
      });
    }

    return () => {
      tl.kill();
    };
  }, [animated]);

  const renderIcon = () => {
    switch (variant) {
      case 'shield':
        return <Shield size={size} color={color} />;
      case 'lock':
        return <Lock size={size} color={color} />;
      case 'zap':
        return <Zap size={size} color={color} />;
      case 'custom':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Outer ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="3"
              opacity="0.6"
            />
            
            {/* Inner shield shape */}
            <path
              ref={pathRef}
              d="M50 10 L75 25 L75 50 Q75 75 50 85 Q25 75 25 50 L25 25 Z"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              filter={glowEffect ? "url(#glow)" : undefined}
            />
            
            {/* Center dot */}
            <circle
              cx="50"
              cy="50"
              r="8"
              fill="url(#logoGradient)"
              filter={glowEffect ? "url(#glow)" : undefined}
            />
            
            {/* Animated particles */}
            <g className="particles">
              {[...Array(6)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="2"
                  fill={color}
                  initial={{ opacity: 0 }}
                  animate={{
                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </g>
          </svg>
        );
      default:
        return <Shield size={size} color={color} />;
    }
  };

  return (
    <motion.div
      ref={logoRef}
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Main logo */}
      <div className="relative z-10">
        {renderIcon()}
      </div>
      
      {/* Glow effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-50"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Orbital rings */}
      {animated && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-opacity-20 rounded-full"
              style={{ 
                borderColor: color,
                transform: `scale(${1.2 + i * 0.3})`
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 10 + i * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AnimatedLogo;
