import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Brain,
  Shield,
  Zap,
  Lock,
  Eye,
  Cpu,
  Network,
  CheckCircle,
  Sparkles,
  Activity,
  Database,
  Key,
  Layers,
  Atom,
  Binary,
  Code,
  Fingerprint,
  Hexagon,
  Infinity,
  Radar,
  Scan,
  Server,
  Waves
} from 'lucide-react';

interface LoadingStage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  color: string;
  gradient: string;
  neuralActivity: number;
  securityLevel: 'low' | 'medium' | 'high' | 'maximum';
}

interface NeuralNode {
  id: number;
  x: number;
  y: number;
  connections: number[];
  activity: number;
  type: 'input' | 'hidden' | 'output';
}

const AdvancedLoader: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particleCount, setParticleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([]);
  const [dataFlowActive, setDataFlowActive] = useState(false);
  const [securityScanActive, setSecurityScanActive] = useState(false);
  const [quantumEffectActive, setQuantumEffectActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const controls = useAnimation();

  const stages: LoadingStage[] = [
    {
      id: 'initialization',
      title: 'Quantum Initialization',
      description: 'Preparing quantum-secured analysis environment',
      icon: <Atom className="w-6 h-6" />,
      duration: 1800,
      color: 'text-cyan-400',
      gradient: 'from-cyan-500 to-blue-500',
      neuralActivity: 0.3,
      securityLevel: 'medium'
    },
    {
      id: 'encryption',
      title: 'Neural Encryption',
      description: 'Securing data with quantum-resistant AES-256-GCM',
      icon: <Fingerprint className="w-6 h-6" />,
      duration: 2200,
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-indigo-500',
      neuralActivity: 0.5,
      securityLevel: 'high'
    },
    {
      id: 'tokenization',
      title: 'Semantic Parsing',
      description: 'Advanced NLP tokenization with transformer models',
      icon: <Binary className="w-6 h-6" />,
      duration: 2800,
      color: 'text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500',
      neuralActivity: 0.7,
      securityLevel: 'high'
    },
    {
      id: 'processing',
      title: 'Neural Processing',
      description: 'Multi-layer transformer analysis with attention mechanisms',
      icon: <Brain className="w-6 h-6" />,
      duration: 3500,
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-500',
      neuralActivity: 0.9,
      securityLevel: 'maximum'
    },
    {
      id: 'scoring',
      title: 'Quantum Scoring',
      description: 'Probabilistic evaluation across dimensional criteria',
      icon: <Radar className="w-6 h-6" />,
      duration: 2800,
      color: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-500',
      neuralActivity: 0.8,
      securityLevel: 'maximum'
    },
    {
      id: 'verification',
      title: 'Cryptographic Proof',
      description: 'Generating zero-knowledge proof of analysis integrity',
      icon: <Hexagon className="w-6 h-6" />,
      duration: 2200,
      color: 'text-emerald-400',
      gradient: 'from-emerald-500 to-green-500',
      neuralActivity: 0.6,
      securityLevel: 'maximum'
    },
    {
      id: 'complete',
      title: 'Analysis Complete',
      description: 'Quantum-verified results ready for secure delivery',
      icon: <CheckCircle className="w-6 h-6" />,
      duration: 1200,
      color: 'text-green-400',
      gradient: 'from-green-500 to-teal-500',
      neuralActivity: 1.0,
      securityLevel: 'maximum'
    }
  ];

  const generateNeuralNodes = useCallback(() => {
    const nodes: NeuralNode[] = [];
    const layers = [4, 8, 6, 3]; 
    let nodeId = 0;

    layers.forEach((layerSize, layerIndex) => {
      for (let i = 0; i < layerSize; i++) {
        nodes.push({
          id: nodeId++,
          x: (layerIndex * 120) + 50,
          y: (i * 60) + 50 + (layerIndex % 2) * 30,
          connections: [],
          activity: Math.random(),
          type: layerIndex === 0 ? 'input' : layerIndex === layers.length - 1 ? 'output' : 'hidden'
        });
      }
    });

    let currentNodeIndex = 0;
    for (let layer = 0; layer < layers.length - 1; layer++) {
      const currentLayerSize = layers[layer];
      const nextLayerSize = layers[layer + 1];

      for (let i = 0; i < currentLayerSize; i++) {
        const currentNode = nodes[currentNodeIndex + i];
        for (let j = 0; j < nextLayerSize; j++) {
          const nextNodeIndex = currentNodeIndex + currentLayerSize + j;
          currentNode.connections.push(nextNodeIndex);
        }
      }
      currentNodeIndex += currentLayerSize;
    }

    setNeuralNodes(nodes);
  }, []);

  const animateNeuralNetwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentStageData = stages[currentStage];
    const activity = currentStageData.neuralActivity;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    neuralNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = neuralNodes.find(n => n.id === connectionId);
        if (!targetNode) return;

        const opacity = Math.sin(Date.now() * 0.003 + node.id) * 0.3 + 0.4;
        const gradient = ctx.createLinearGradient(node.x, node.y, targetNode.x, targetNode.y);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity * activity})`);
        gradient.addColorStop(1, `rgba(147, 51, 234, ${opacity * activity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      });
    });

    neuralNodes.forEach(node => {
      const pulse = Math.sin(Date.now() * 0.005 + node.id) * 0.3 + 0.7;
      const radius = (node.type === 'input' ? 8 : node.type === 'output' ? 10 : 6) * pulse;

      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      gradient.addColorStop(0, `rgba(99, 102, 241, ${activity})`);
      gradient.addColorStop(1, `rgba(147, 51, 234, ${activity * 0.3})`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animateNeuralNetwork);
  }, [neuralNodes, currentStage, stages]);

  useEffect(() => {
    generateNeuralNodes();
  }, [generateNeuralNodes]);

  useEffect(() => {
    if (neuralNodes.length > 0) {
      animateNeuralNetwork();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [neuralNodes, animateNeuralNetwork]);

  useEffect(() => {
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      let cumulativeDuration = 0;
      for (let i = 0; i < stages.length; i++) {
        cumulativeDuration += stages[i].duration;
        if (elapsed <= cumulativeDuration) {
          setCurrentStage(i);
          break;
        }
      }

      setParticleCount(Math.floor(newProgress / 3) + 15);

      setDataFlowActive(currentStage >= 2);
      setSecurityScanActive(currentStage >= 1);
      setQuantumEffectActive(currentStage >= 3);

      if (elapsed >= totalDuration) {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentStage, stages]);

  const currentStageData = stages[currentStage];

  return (
    <div className="flex flex-col items-center justify-center min-h-[700px] glass-card p-12 rounded-3xl relative overflow-hidden">
      {}
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        style={{ filter: 'blur(1px)' }}
      />

      {}
      {quantumEffectActive && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`quantum-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
              className="absolute w-32 h-32 border-2 border-purple-400/30 rounded-full"
              style={{
                left: `${20 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 30}%`
              }}
            />
          ))}
        </div>
      )}

      {}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 600,
              y: Math.random() * 600,
              opacity: 0,
              scale: 0
            }}
            animate={{
              x: Math.random() * 600,
              y: Math.random() * 600,
              opacity: [0, 0.9, 0],
              scale: [0, Math.random() * 2 + 0.5, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className={`absolute w-3 h-3 bg-gradient-to-r ${currentStageData.gradient} rounded-full blur-sm shadow-lg`}
          />
        ))}
      </div>

      {}
      {securityScanActive && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`scan-${i}`}
              initial={{ x: '-100%', opacity: 0 }}
              animate={{
                x: ['100%', '-100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "linear"
              }}
              className="absolute h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{ top: `${30 + i * 20}%` }}
            />
          ))}
        </div>
      )}

      {}
      {dataFlowActive && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`flow-${i}`}
              initial={{ y: '-100%', opacity: 0 }}
              animate={{
                y: ['100%', '-100%'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear"
              }}
              className="absolute w-0.5 h-20 bg-gradient-to-b from-transparent via-indigo-400 to-transparent"
              style={{ left: `${15 + i * 15}%` }}
            />
          ))}
        </div>
      )}

      {}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={Math.random() * 400}
              cy={Math.random() * 400}
              r="2"
              fill="currentColor"
              className={currentStageData.color}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                r: [1, 3, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.line
              key={i}
              x1={Math.random() * 400}
              y1={Math.random() * 400}
              x2={Math.random() * 400}
              y2={Math.random() * 400}
              stroke="currentColor"
              strokeWidth="1"
              className={currentStageData.color}
              animate={{
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </svg>
      </div>

      {}
      <div className="relative z-10 flex flex-col items-center">
        {}
        <div className="relative w-48 h-48 mb-12">
          {}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 w-48 h-48 border-4 border-transparent border-t-current border-r-current rounded-full ${currentStageData.color}`}
            style={{
              filter: 'drop-shadow(0 0 10px currentColor)',
            }}
          />

          {}
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`absolute inset-4 w-40 h-40 border-3 border-transparent border-t-current border-l-current rounded-full ${currentStageData.color} opacity-80`}
          />

          {}
          <motion.div
            animate={{
              rotate: 360,
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`absolute inset-8 w-32 h-32 border-2 border-transparent border-t-current border-b-current rounded-full ${currentStageData.color} opacity-60`}
          />

          {}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              boxShadow: [
                `0 0 20px rgba(99, 102, 241, 0.5)`,
                `0 0 40px rgba(147, 51, 234, 0.8)`,
                `0 0 20px rgba(99, 102, 241, 0.5)`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 w-48 h-48 bg-gradient-to-r ${currentStageData.gradient} rounded-full flex items-center justify-center text-white shadow-2xl`}
            style={{
              background: `conic-gradient(from 0deg, ${currentStageData.gradient.includes('cyan') ? '#06b6d4' : currentStageData.gradient.includes('blue') ? '#3b82f6' : currentStageData.gradient.includes('indigo') ? '#6366f1' : currentStageData.gradient.includes('purple') ? '#8b5cf6' : currentStageData.gradient.includes('pink') ? '#ec4899' : currentStageData.gradient.includes('emerald') ? '#10b981' : '#22c55e'}, transparent, ${currentStageData.gradient.includes('cyan') ? '#0891b2' : currentStageData.gradient.includes('blue') ? '#2563eb' : currentStageData.gradient.includes('indigo') ? '#4f46e5' : currentStageData.gradient.includes('purple') ? '#7c3aed' : currentStageData.gradient.includes('pink') ? '#db2777' : currentStageData.gradient.includes('emerald') ? '#059669' : '#16a34a'})`
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -180, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              {currentStageData.icon}
            </motion.div>

            {}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`inner-particle-${i}`}
                  animate={{
                    rotate: [0, 360],
                    scale: [0.5, 1, 0.5],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2 + i * 0.1,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${50 + 35 * Math.cos((i * 30) * Math.PI / 180)}%`,
                    top: `${50 + 35 * Math.sin((i * 30) * Math.PI / 180)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, 360]
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
            className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
          >
            {currentStageData.securityLevel === 'low' ? 'L' :
             currentStageData.securityLevel === 'medium' ? 'M' :
             currentStageData.securityLevel === 'high' ? 'H' : 'MAX'}
          </motion.div>
        </div>

        {}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <motion.h3
              animate={{
                textShadow: [
                  "0 0 0px rgba(99, 102, 241, 0)",
                  "0 0 25px rgba(99, 102, 241, 0.8)",
                  "0 0 0px rgba(99, 102, 241, 0)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-4xl font-bold text-white mb-4 tracking-wide"
            >
              {currentStageData.title}
            </motion.h3>
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/80 text-xl max-w-lg leading-relaxed"
            >
              {currentStageData.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {}
        <div className="w-full max-w-2xl mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Scan className="w-5 h-5 text-cyan-400" />
              </motion.div>
              <span className="text-white/80 text-sm font-medium">Quantum Analysis Progress</span>
            </div>
            <div className="flex items-center gap-3">
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 0px rgba(99, 102, 241, 0)",
                    "0 0 10px rgba(99, 102, 241, 0.8)",
                    "0 0 0px rgba(99, 102, 241, 0)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white font-bold text-xl"
              >
                {Math.round(progress)}%
              </motion.span>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${currentStageData.color.replace('text-', 'bg-')}`}
              />
            </div>
          </div>

          {}
          <div className="relative">
            {}
            <div className="h-6 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 relative">
              {}
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.3) 25%, rgba(147, 51, 234, 0.3) 50%, rgba(99, 102, 241, 0.3) 75%, transparent 100%)',
                  backgroundSize: '200% 100%'
                }}
              />

              {}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${currentStageData.gradient} rounded-full relative overflow-hidden`}
                style={{
                  boxShadow: `0 0 20px ${currentStageData.color.replace('text-', '').replace('-400', '')}`
                }}
              >
                {}
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />

                {}
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`progress-particle-${i}`}
                      animate={{
                        x: ['-10px', '100%'],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                      className="absolute top-1/2 w-2 h-2 bg-white rounded-full transform -translate-y-1/2"
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -bottom-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {}
          <div className="flex justify-between mt-4 text-xs text-white/60">
            <span>Neural Activity: {Math.round(currentStageData.neuralActivity * 100)}%</span>
            <span>Security: {currentStageData.securityLevel.toUpperCase()}</span>
            <span>Stage: {currentStage + 1}/{stages.length}</span>
          </div>
        </div>

        {}
        <div className="flex gap-6 mb-8 relative">
          {}
          <svg className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 -z-10">
            {stages.map((_, index) => (
              index < stages.length - 1 && (
                <motion.line
                  key={`connection-${index}`}
                  x1={`${(index + 1) * (100 / stages.length)}%`}
                  y1="50%"
                  x2={`${(index + 2) * (100 / stages.length)}%`}
                  y2="50%"
                  stroke={index < currentStage ? "#10b981" : index === currentStage ? "url(#stageGradient)" : "rgba(255,255,255,0.2)"}
                  strokeWidth="2"
                  animate={{
                    pathLength: index <= currentStage ? 1 : 0,
                    opacity: index <= currentStage ? 1 : 0.3
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              )
            ))}
            <defs>
              <linearGradient id="stageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              animate={{
                scale: index === currentStage ? [1, 1.3, 1] : index < currentStage ? 1.1 : 1,
                opacity: index <= currentStage ? 1 : 0.4
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex flex-col items-center"
            >
              {}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center relative ${
                index < currentStage
                  ? 'bg-green-400 border-green-400 shadow-lg shadow-green-400/50'
                  : index === currentStage
                  ? `bg-gradient-to-r ${currentStageData.gradient} border-transparent shadow-lg`
                  : 'bg-white/10 border-white/30'
              }`}>
                {index < currentStage ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : index === currentStage ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    {stage.icon}
                  </motion.div>
                ) : (
                  <div className="w-2 h-2 bg-white/50 rounded-full" />
                )}
              </div>

              {}
              {index === currentStage && (
                <motion.div
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 w-6 h-6 bg-gradient-to-r ${currentStageData.gradient} rounded-full`}
                />
              )}

              {}
              <motion.span
                animate={{
                  opacity: index === currentStage ? [0.7, 1, 0.7] : 0.6,
                  scale: index === currentStage ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 1.5, repeat: index === currentStage ? Infinity : 0 }}
                className="text-xs text-white/70 mt-2 text-center max-w-16"
              >
                {stage.title.split(' ')[0]}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[Atom, Binary, Code, Fingerprint, Hexagon, Infinity, Radar, Server, Waves].map((Icon, i) => (
            <motion.div
              key={`tech-icon-${i}`}
              animate={{
                x: [0, 80 * Math.cos(i), -80 * Math.cos(i), 0],
                y: [0, -60 * Math.sin(i), 60 * Math.sin(i), 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.7, 0.1],
                scale: [0.6, 1.4, 0.6]
              }}
              transition={{
                duration: 6 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              className={`absolute ${currentStageData.color} opacity-20`}
              style={{
                left: `${10 + (i % 4) * 20}%`,
                top: `${15 + Math.floor(i / 4) * 25}%`,
                filter: 'blur(0.5px)'
              }}
            >
              <Icon className="w-6 h-6" />

              {}
              <motion.div
                animate={{
                  scale: [0, 2, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className={`absolute inset-0 w-6 h-6 border border-current rounded-full`}
              />
            </motion.div>
          ))}
        </div>

        {}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md rounded-3xl"
          >
            {}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`burst-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 3, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos((i * 18) * Math.PI / 180) * 200,
                    y: Math.sin((i * 18) * Math.PI / 180) * 200
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                />
              ))}
            </div>

            {}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.3, 1],
                rotate: [0, 360, 720]
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                times: [0, 0.6, 1]
              }}
              className="relative z-10 mb-6"
            >
              <div className="relative">
                <CheckCircle className="w-24 h-24 text-green-400" />

                {}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full blur-xl opacity-50"
                />
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center z-10"
            >
              <h3 className="text-3xl font-bold text-white mb-2">
                Analysis Complete!
              </h3>
              <p className="text-white/80 text-lg">
                Quantum verification successful
              </p>
            </motion.div>

            {}
            <div className="absolute inset-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={`success-particle-${i}`}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: 0.5 + Math.random() * 2,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedLoader;
