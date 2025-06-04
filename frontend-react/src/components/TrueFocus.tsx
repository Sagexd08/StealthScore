import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = 'red',
  animationDuration = 2,
  pauseBetweenAnimations = 1,
  className = '',
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const words = sentence.split(' ');

  useEffect(() => {
    if (!manualMode) {
      startAnimation();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [manualMode, sentence]);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    let currentIndex = 0;
    
    const animate = () => {
      setFocusedIndex(currentIndex);
      currentIndex = (currentIndex + 1) % words.length;
      
      if (currentIndex === 0) {
        setTimeout(() => {
          setFocusedIndex(-1);
          setTimeout(() => {
            setIsAnimating(false);
            setTimeout(startAnimation, pauseBetweenAnimations * 1000);
          }, 500);
        }, animationDuration * 1000);
      }
    };

    animate();
    intervalRef.current = setInterval(animate, animationDuration * 1000);
  };

  const handleWordClick = (index: number) => {
    if (manualMode) {
      setFocusedIndex(index === focusedIndex ? -1 : index);
    }
  };

  return (
    <div className={`true-focus-container ${className}`}>
      <div className="flex flex-wrap justify-center items-center gap-2 text-4xl md:text-6xl font-bold">
        {words.map((word, index) => (
          <motion.span
            key={index}
            className={`relative cursor-pointer transition-all duration-300 ${
              focusedIndex === index ? 'text-white' : 'text-gray-400'
            }`}
            style={{
              filter: focusedIndex !== -1 && focusedIndex !== index 
                ? `blur(${blurAmount}px)` 
                : 'none',
            }}
            onClick={() => handleWordClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {word}
            
            {/* Animated border effect */}
            <AnimatePresence>
              {focusedIndex === index && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Top border */}
                  <motion.div
                    className="absolute top-0 left-0 h-0.5"
                    style={{ backgroundColor: borderColor }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: animationDuration * 0.25 }}
                  />
                  
                  {/* Right border */}
                  <motion.div
                    className="absolute top-0 right-0 w-0.5"
                    style={{ backgroundColor: borderColor }}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ 
                      duration: animationDuration * 0.25,
                      delay: animationDuration * 0.25 
                    }}
                  />
                  
                  {/* Bottom border */}
                  <motion.div
                    className="absolute bottom-0 right-0 h-0.5"
                    style={{ backgroundColor: borderColor }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ 
                      duration: animationDuration * 0.25,
                      delay: animationDuration * 0.5 
                    }}
                  />
                  
                  {/* Left border */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0.5"
                    style={{ backgroundColor: borderColor }}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ 
                      duration: animationDuration * 0.25,
                      delay: animationDuration * 0.75 
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Glow effect */}
            {focusedIndex === index && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: `0 0 20px ${borderColor}`,
                  borderRadius: '4px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.span>
        ))}
      </div>
      
      {manualMode && (
        <motion.p
          className="text-center text-gray-400 text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Click on any word to focus
        </motion.p>
      )}
    </div>
  );
};

export default TrueFocus;
