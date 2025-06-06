import React, { Suspense, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

interface Spline3DHeroProps {
  className?: string;
}

const Spline3DHero: React.FC<Spline3DHeroProps> = ({ className = '' }) => {
  const splineRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const onLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setIsLoaded(true);
  };

  const onError = () => {
    setError(true);
  };

  // Fallback 3D-like animation when Spline fails to load
  const Fallback3D = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Main central sphere */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full blur-sm"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Orbiting elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 100],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5
            }}
          />
        ))}

        {/* Floating cubes */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`cube-${i}`}
            className="absolute w-6 h-6 bg-gradient-to-br from-purple-500/40 to-pink-500/40 backdrop-blur-sm"
            style={{
              top: `${20 + i * 20}%`,
              left: `${15 + i * 20}%`,
              transform: 'rotateX(45deg) rotateY(45deg)',
            }}
            animate={{
              y: [-10, 10, -10],
              rotateX: [45, 90, 45],
              rotateY: [45, 90, 45],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          />
        ))}

        {/* Particle field */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/60 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </motion.div>

      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm rounded-2xl" />
    </div>
  );

  return (
    <motion.div
      className={`relative w-full h-96 rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {!error ? (
        <Suspense fallback={<Fallback3D />}>
          <div className="w-full h-full">
            <Spline
              scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
              onLoad={onLoad}
              onError={onError}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent'
              }}
            />
            {!isLoaded && <Fallback3D />}
          </div>
        </Suspense>
      ) : (
        <Fallback3D />
      )}

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default Spline3DHero;
