import React from 'react';
import { motion } from 'framer-motion';
import SplitText from './SplitText';

interface EnhancedSectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  gradient?: string;
  className?: string;
  centered?: boolean;
}

const EnhancedSectionHeader: React.FC<EnhancedSectionHeaderProps> = ({
  title,
  subtitle,
  description,
  gradient = "from-indigo-400 via-purple-400 to-pink-400",
  className = "",
  centered = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`${centered ? 'text-center' : ''} ${className}`}
    >
      {}
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/10 backdrop-blur-sm mb-6"
        >
          <span className={`text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {subtitle}
          </span>
        </motion.div>
      )}

      {}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mb-6"
      >
        <SplitText
          text={title}
          className={`text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-tight`}
          delay={0.1}
        />
      </motion.div>

      {}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
        >
          {description}
        </motion.p>
      )}

      {}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.7 }}
        className={`h-1 w-24 bg-gradient-to-r ${gradient} rounded-full ${centered ? 'mx-auto' : ''} mt-8`}
      />
      
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${gradient} rounded-full opacity-30`}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedSectionHeader;
