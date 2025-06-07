import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Floating3DBackgroundProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  particleCount?: number;
  enableHover?: boolean;
  enableClick?: boolean;
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan';
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  shape: 'sphere' | 'cube' | 'triangle' | 'diamond';
}

const Floating3DBackground: React.FC<Floating3DBackgroundProps> = ({
  children,
  className = '',
  intensity = 'medium',
  particleCount = 15,
  enableHover = true,
  enableClick = true,
  colorScheme = 'blue'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; id: number } | null>(null);

  const colorSchemes = {
    blue: ['#3b82f6', '#1d4ed8', '#60a5fa', '#93c5fd'],
    purple: ['#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd'],
    green: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
    orange: ['#f97316', '#ea580c', '#fb923c', '#fdba74'],
    pink: ['#ec4899', '#db2777', '#f472b6', '#f9a8d4'],
    cyan: ['#06b6d4', '#0891b2', '#22d3ee', '#67e8f9']
  };

  const intensitySettings = {
    low: { count: 8, maxSize: 12, maxSpeed: 0.5 },
    medium: { count: 15, maxSize: 16, maxSpeed: 1 },
    high: { count: 25, maxSize: 20, maxSpeed: 1.5 }
  };

  const settings = intensitySettings[intensity];
  const colors = colorSchemes[colorScheme];

  useEffect(() => {
    const generateElements = (): FloatingElement[] => {
      const shapes: FloatingElement['shape'][] = ['sphere', 'cube', 'triangle', 'diamond'];
      
      return Array.from({ length: Math.min(particleCount, settings.count) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100,
        size: Math.random() * settings.maxSize + 4,
        speed: Math.random() * settings.maxSpeed + 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      }));
    };

    setElements(generateElements());
  }, [particleCount, intensity, colorScheme]);

  const handleClick = (e: React.MouseEvent) => {
    if (!enableClick) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setClickEffect({ x, y, id: Date.now() });
      setTimeout(() => setClickEffect(null), 1000);
    }
  };

  const getShapeComponent = (element: FloatingElement) => {
    const baseClasses = "absolute transition-all duration-1000 ease-out";
    const hoverScale = isHovered ? 1.2 : 1;
    const clickScale = clickEffect ? 1.5 : 1;
    
    const style = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      backgroundColor: element.color,
      opacity: element.opacity * (isHovered ? 1.5 : 1),
      transform: `
        translateZ(${element.z}px) 
        rotate(${element.rotation}deg) 
        scale(${hoverScale * clickScale})
      `,
      filter: `blur(${isHovered ? 0 : 1}px)`,
    };

    switch (element.shape) {
      case 'sphere':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses} rounded-full`}
            style={style}
            animate={{
              x: [0, Math.sin(element.speed) * 20, 0],
              y: [0, Math.cos(element.speed) * 15, 0],
              rotate: [element.rotation, element.rotation + 360],
            }}
            transition={{
              duration: 8 + element.speed * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      
      case 'cube':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses} border border-current`}
            style={{
              ...style,
              backgroundColor: 'transparent',
              borderColor: element.color,
            }}
            animate={{
              x: [0, Math.cos(element.speed) * 25, 0],
              y: [0, Math.sin(element.speed) * 20, 0],
              rotateX: [0, 360],
              rotateY: [0, 180],
            }}
            transition={{
              duration: 10 + element.speed * 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      
      case 'triangle':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses}`}
            style={{
              ...style,
              backgroundColor: 'transparent',
              borderLeft: `${element.size / 2}px solid transparent`,
              borderRight: `${element.size / 2}px solid transparent`,
              borderBottom: `${element.size}px solid ${element.color}`,
              width: 0,
              height: 0,
            }}
            animate={{
              x: [0, Math.sin(element.speed * 1.5) * 30, 0],
              y: [0, Math.cos(element.speed * 1.5) * 25, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + element.speed * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      case 'diamond':
        return (
          <motion.div
            key={element.id}
            className={`${baseClasses}`}
            style={{
              ...style,
              backgroundColor: element.color,
              clipPath: 'polygon(50% 0%, 0% 50%, 50% 100%, 100% 50%)',
            }}
            animate={{
              x: [0, Math.cos(element.speed * 0.8) * 35, 0],
              y: [0, Math.sin(element.speed * 0.8) * 30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + element.speed * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => enableHover && setIsHovered(true)}
      onMouseLeave={() => enableHover && setIsHovered(false)}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      {}
      <div className="absolute inset-0 pointer-events-none">
        {elements.map(element => getShapeComponent(element))}
        
        {}
        {clickEffect && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: `${clickEffect.x}%`,
              top: `${clickEffect.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-${colorScheme}-400 to-${colorScheme}-600`} />
          </motion.div>
        )}
      </div>

      {}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      
      {}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Floating3DBackground;
