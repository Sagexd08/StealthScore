import React from 'react';
import { motion } from 'framer-motion';

interface PixelCardProps {
  children: React.ReactNode;
  variant?: 'blue' | 'pink' | 'green' | 'purple' | 'yellow';
  className?: string;
  onClick?: () => void;
}

const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  variant = 'blue', 
  className = '',
  onClick 
}) => {
  const variantStyles = {
    blue: 'bg-blue-500/10 border-blue-400/30 hover:bg-blue-500/20',
    pink: 'bg-pink-500/10 border-pink-400/30 hover:bg-pink-500/20',
    green: 'bg-green-500/10 border-green-400/30 hover:bg-green-500/20',
    purple: 'bg-purple-500/10 border-purple-400/30 hover:bg-purple-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-400/30 hover:bg-yellow-500/20'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        transition-all duration-300 cursor-pointer
        ${variantStyles[variant]}
        ${className}
      `}
      onClick={onClick}
    >
      {}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px'
          }}
        />
      </div>
      
      {}
      <div className="relative z-10">
        {children}
      </div>
      
      {}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 rounded-xl blur-xl ${
          variant === 'blue' ? 'bg-blue-400/20' :
          variant === 'pink' ? 'bg-pink-400/20' :
          variant === 'green' ? 'bg-green-400/20' :
          variant === 'purple' ? 'bg-purple-400/20' :
          'bg-yellow-400/20'
        }`} />
      </div>
    </motion.div>
  );
};

export default PixelCard;
