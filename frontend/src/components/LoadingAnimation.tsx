import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Zap, Shield, Sparkles, Lock, Eye, Target, TrendingUp, Cpu, Network,
         Database, CheckCircle, Loader2, Code, Fingerprint, Globe } from 'lucide-react'
import { gsap } from 'gsap'
import ClickSpark from './ClickSpark'

const LoadingAnimation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const particleRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: Shield,
      text: "Initializing dual encryption protocols...",
      color: "text-green-400",
      detail: "AES-256 + RSA-4096 encryption layers active",
      duration: 2000
    },
    {
      icon: Lock,
      text: "Establishing secure TEE connection...",
      color: "text-blue-400",
      detail: "Trusted Execution Environment initialized",
      duration: 1800
    },
    {
      icon: Cpu,
      text: "Pre-processing pitch data...",
      color: "text-cyan-400",
      detail: "Tokenizing and sanitizing input data",
      duration: 1500
    },
    {
      icon: Brain,
      text: "AI neural networks analyzing content...",
      color: "text-purple-400",
      detail: "Processing 47 linguistic patterns",
      duration: 3000
    },
    {
      icon: Eye,
      text: "Evaluating pitch structure & clarity...",
      color: "text-indigo-400",
      detail: "Analyzing narrative flow and coherence",
      duration: 2500
    },
    {
      icon: Network,
      text: "Cross-referencing market intelligence...",
      color: "text-orange-400",
      detail: "Accessing federated learning networks",
      duration: 2200
    },
    {
      icon: Target,
      text: "Performing security verification...",
      color: "text-red-400",
      detail: "Validating data integrity and privacy",
      duration: 1800
    },
    {
      icon: TrendingUp,
      text: "Computing StealthScore metrics...",
      color: "text-pink-400",
      detail: "Generating comprehensive analysis",
      duration: 1500
    },
    {
      icon: Sparkles,
      text: "Finalizing insights & recommendations...",
      color: "text-yellow-400",
      detail: "Preparing actionable feedback",
      duration: 1000
    },
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return 0; // Loop back to start
      });
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <ClickSpark sparkColor="#3b82f6" sparkCount={15} sparkRadius={50}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        {/* Enhanced Main Loading Circle with ClickSpark */}
        <ClickSpark sparkColor="#8b5cf6" sparkCount={20} sparkRadius={60}>
          <motion.div
            className="relative mb-12"
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "back.out(1.7)" }}
          >
        {/* Outer Ring with Progress */}
        <motion.div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              fill="none"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={440}
              strokeDashoffset={440 - (progress / 100) * 440}
              transition={{ duration: 0.1 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Progress Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{progress}%</span>
          </div>
        </motion.div>

        {/* Rotating Neural Network Visualization */}
        <motion.div
          className="absolute inset-8 border-2 border-purple-400/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          {/* Neural Network Nodes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-purple-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 60}deg) translateX(45px) translateY(-6px)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Center Brain Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Brain className="w-16 h-16 text-purple-400" />
        </motion.div>

        {/* Enhanced Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
          </motion.div>
        </ClickSpark>

      {/* Enhanced Loading Steps */}
      <div className="space-y-4 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 border border-white/20"
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
                className={`p-3 rounded-full bg-gradient-to-r from-white/10 to-white/20 ${steps[currentStep].color}`}
              >
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
              </motion.div>

              <div className="flex-1">
                <motion.p
                  className={`font-semibold text-lg ${steps[currentStep].color}`}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {steps[currentStep].text}
                </motion.p>
                <motion.p
                  className="text-white/60 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {steps[currentStep].detail}
                </motion.p>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-green-400 font-bold text-sm">
                  <motion.span
                    key={`security-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {Math.floor(Math.random() * 20) + 80}%
                  </motion.span>
                </div>
                <div className="text-white/60 text-xs">Security</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-blue-400 font-bold text-sm">
                  <motion.span
                    key={`processing-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {Math.floor(Math.random() * 30) + 70}%
                  </motion.span>
                </div>
                <div className="text-white/60 text-xs">Processing</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-purple-400 font-bold text-sm">
                  <motion.span
                    key={`accuracy-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {Math.floor(Math.random() * 15) + 85}%
                  </motion.span>
                </div>
                <div className="text-white/60 text-xs">Accuracy</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 4 === 0 ? 'bg-blue-400/40' :
              i % 4 === 1 ? 'bg-purple-400/40' :
              i % 4 === 2 ? 'bg-pink-400/40' : 'bg-cyan-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, -150],
              x: [0, Math.random() * 40 - 20],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Data Flow Visualization */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`flow-${i}`}
            className="absolute w-px h-8 bg-gradient-to-t from-transparent via-blue-400/50 to-transparent"
            style={{
              left: `${10 + i * 10}%`,
              top: '20%',
            }}
            animate={{
              y: [0, 300],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        ))}
      </div>

      {/* Enhanced Status Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-8 text-center"
      >
        <motion.p
          className="text-xl font-bold text-white mb-2"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          StealthScore AI Analysis in Progress
        </motion.p>
        <motion.p
          className="text-sm text-white/70 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Advanced neural networks are evaluating your pitch with military-grade privacy protection
        </motion.p>

        {/* Live Processing Indicators */}
        <div className="flex justify-center items-center gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span>TEE Active</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span>AI Processing</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span>Encrypted</span>
          </div>
        </div>
      </motion.div>
      </div>
    </ClickSpark>
  )
}

export default LoadingAnimation
