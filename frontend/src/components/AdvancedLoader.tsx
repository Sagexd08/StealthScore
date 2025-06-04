import React from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface AdvancedLoaderProps {
  message?: string;
  type?: 'dots' | 'pulse' | 'wave' | 'elastic';
}

const AdvancedLoader: React.FC<AdvancedLoaderProps> = ({ 
  message = "Processing...", 
  type = 'elastic' 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current && type === 'elastic') {
      const dots = containerRef.current.querySelectorAll('.elastic-dot');
      
      gsap.set(dots, { scale: 0.5, opacity: 0.3 });
      
      const tl = gsap.timeline({ repeat: -1 });
      
      dots.forEach((dot, index) => {
        tl.to(dot, {
          scale: 1.5,
          opacity: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.3)",
          yoyo: true,
          repeat: 1
        }, index * 0.1);
      });
    }
  }, [type]);

  const renderDots = () => {
    switch (type) {
      case 'elastic':
        return (
          <div ref={containerRef} className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="elastic-dot w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              />
            ))}
          </div>
        );
      
      case 'wave':
        return (
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-8 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full"
                animate={{
                  scaleY: [0.3, 1, 0.3],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      case 'dots':
      default:
        return (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center space-y-6 p-8"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
              "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))",
              "linear-gradient(225deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
              "linear-gradient(315deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Loader Animation */}
      <div className="relative z-10">
        {renderDots()}
      </div>

      {/* Message */}
      <motion.p
        className="text-white/80 text-lg font-medium relative z-10"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {message}
      </motion.p>

      {/* Progress Indicator */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default AdvancedLoader;
