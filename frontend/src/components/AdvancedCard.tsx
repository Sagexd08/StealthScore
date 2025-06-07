import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface AdvancedCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  animationType?: 'swap' | 'flip' | 'slide' | 'elastic';
}

const AdvancedCard: React.FC<AdvancedCardProps> = ({
  title,
  description,
  icon,
  gradient = 'from-blue-400 to-purple-500',
  children,
  onClick,
  className = '',
  animationType = 'elastic'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, {
      transformStyle: "preserve-3d",
      perspective: 1000
    });

    if (backRef.current) {
      gsap.set(backRef.current, {
        rotationY: 180,
        backfaceVisibility: "hidden"
      });
    }

    if (frontRef.current) {
      gsap.set(frontRef.current, {
        backfaceVisibility: "hidden"
      });
    }

    const handleMouseEnter = () => {
      setIsHovered(true);
      
      switch (animationType) {
        case 'elastic':
          gsap.to(card, {
            scale: 1.05,
            rotationX: 5,
            rotationY: 5,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
          });
          break;
        
        case 'swap':
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.4,
            ease: "back.out(1.7)"
          });
          break;
        
        case 'slide':
          gsap.to(card, {
            x: 5,
            y: -5,
            scale: 1.03,
            duration: 0.3,
            ease: "power2.out"
          });
          break;
        
        case 'flip':
          if (!isFlipped) {
            gsap.to(card, {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out"
            });
          }
          break;
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      
      gsap.to(card, {
        scale: 1,
        rotationX: 0,
        rotationY: isFlipped ? 180 : 0,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    };

    const handleClick = () => {
      if (animationType === 'flip' && backRef.current) {
        const newFlipped = !isFlipped;
        setIsFlipped(newFlipped);
        
        gsap.to(card, {
          rotationY: newFlipped ? 180 : 0,
          duration: 0.8,
          ease: "back.out(1.7)"
        });
      }
      
      if (onClick) {
        onClick();
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('click', handleClick);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('click', handleClick);
    };
  }, [animationType, isFlipped, onClick]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={cardRef}
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {}
        <div
          ref={frontRef}
          className="absolute inset-0 w-full h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-hidden"
        >
          {}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 transition-opacity duration-500 ${
            isHovered ? 'opacity-20' : 'opacity-10'
          }`} />
          
          {}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer" />
          </div>

          {}
          <div className="relative z-10 h-full flex flex-col">
            {}
            <div className="flex items-center space-x-3 mb-4">
              {icon && (
                <motion.div
                  className={`p-2 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-20`}
                  animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {icon}
                </motion.div>
              )}
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>

            {}
            <p className="text-white/70 text-sm mb-4 flex-grow">{description}</p>

            {}
            {children && (
              <div className="mt-auto">
                {children}
              </div>
            )}

            {}
            <AnimatePresence>
              {isHovered && animationType === 'flip' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 right-4 text-white/50 text-xs"
                >
                  Click to flip
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {}
        {animationType === 'flip' && (
          <div
            ref={backRef}
            className="absolute inset-0 w-full h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
            
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold text-white mb-4">Card Details</h3>
              <p className="text-white/80 text-sm mb-6">
                This is the back side of the card with additional information and interactive elements.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 bg-gradient-to-r ${gradient} rounded-lg text-white font-medium`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                  gsap.to(cardRef.current, {
                    rotationY: 0,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                  });
                }}
              >
                Flip Back
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 blur-xl transition-opacity duration-500 -z-10 ${
        isHovered ? 'opacity-30' : 'opacity-0'
      }`} />
    </div>
  );
};

export default AdvancedCard;
