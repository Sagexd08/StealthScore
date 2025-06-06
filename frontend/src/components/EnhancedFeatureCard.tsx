import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EnhancedFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  delay?: number;
  className?: string;
}

const EnhancedFeatureCard: React.FC<EnhancedFeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  features,
  gradient,
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`group relative ${className}`}
    >
      {/* Main Card */}
      <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Background Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, -30, -10],
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

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h3 
            className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300"
          >
            {title}
          </motion.h3>

          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + (index * 0.1) }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient} shadow-lg`}
                />
                <span className="text-gray-200 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hover Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-transparent"
          whileHover={{
            borderImage: `linear-gradient(45deg, ${gradient.split(' ')[1]}, ${gradient.split(' ')[3]}) 1`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          style={{
            transform: 'skewX(-20deg)',
          }}
        />
      </div>
    </motion.div>
  );
};

export default EnhancedFeatureCard;
