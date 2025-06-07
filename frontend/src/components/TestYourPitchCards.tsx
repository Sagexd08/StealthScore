import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Mic, 
  Video, 
  BarChart3, 
  Shield, 
  Zap, 
  ArrowRight,
  Play,
  Upload,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface PitchTestCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
  action: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

const TestYourPitchCards: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const pitchTestCards: PitchTestCard[] = [
    {
      id: 'document',
      title: 'Pitch Deck Analysis',
      description: 'Upload your pitch deck and get comprehensive AI-powered analysis on structure, content, and investor appeal.',
      icon: <FileText className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Content Analysis', 'Structure Review', 'Visual Assessment', 'Investor Readiness Score'],
      action: 'Upload Deck',
      estimatedTime: '2-3 min',
      difficulty: 'Easy'
    },
    {
      id: 'audio',
      title: 'Pitch Practice Session',
      description: 'Record your pitch presentation and receive feedback on delivery, pacing, and persuasiveness.',
      icon: <Mic className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
      features: ['Speech Analysis', 'Pacing Review', 'Confidence Metrics', 'Improvement Tips'],
      action: 'Start Recording',
      estimatedTime: '5-10 min',
      difficulty: 'Medium'
    },
    {
      id: 'video',
      title: 'Full Pitch Simulation',
      description: 'Complete video pitch analysis with body language, presentation skills, and overall impact assessment.',
      icon: <Video className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Body Language', 'Presentation Skills', 'Engagement Score', 'Professional Feedback'],
      action: 'Record Video',
      estimatedTime: '10-15 min',
      difficulty: 'Advanced'
    }
  ];

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId);
    
    console.log(`Starting ${cardId} test...`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Test Your Pitch
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Choose your preferred method to analyze and improve your startup pitch with AI-powered insights
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {pitchTestCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="group relative cursor-pointer"
            onHoverStart={() => setHoveredCard(card.id)}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => handleCardClick(card.id)}
          >
            <motion.div
              className="glass-card p-8 h-full relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {}
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                    {card.difficulty}
                  </span>
                  <div className="flex items-center text-white/60 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {card.estimatedTime}
                  </div>
                </div>
              </div>

              {}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                {card.title}
              </h3>
              
              <p className="text-white/70 leading-relaxed mb-6">
                {card.description}
              </p>

              {}
              <div className="space-y-2 mb-8">
                {card.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + idx * 0.1 }}
                    className="flex items-center text-white/60 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    {feature}
                  </motion.div>
                ))}
              </div>

              {}
              <motion.button
                className={`w-full py-3 px-6 bg-gradient-to-r ${card.gradient} rounded-xl text-white font-semibold flex items-center justify-center space-x-2 group-hover:shadow-lg transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{card.action}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {}
              <AnimatePresence>
                {hoveredCard === card.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="glass-card p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-indigo-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Privacy-First Analysis</h3>
          </div>
          <p className="text-white/70 leading-relaxed">
            All analysis happens with end-to-end encryption. Your pitch data never leaves your device in plain text, 
            ensuring complete confidentiality while you get professional-grade feedback.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-6">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Zero-Knowledge</span>
            </div>
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestYourPitchCards;
