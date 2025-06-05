/**
 * PitchGuard Lite - Stunning Landing Page
 * Author: Augment Agent
 * Date: 2025
 *
 * A visually stunning, interactive, and fully responsive landing page
 * featuring glassmorphism design, Framer Motion animations, and modern UI/UX
 */

import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Brain,
  Receipt,
  Lock,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Github,
  Mail,
  Twitter,
  Linkedin,
  Play,
  CheckCircle,
  Zap,
  Globe,
  Users,
  BookOpen,
  Palette,
  Target,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

// TypeScript Interfaces
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface CriteriaCircleProps {
  title: string;
  icon: React.ReactNode;
  score: number;
  maxScore: number;
  delay?: number;
}

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface LandingPageProps {
  onGetStarted: () => void;
}

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Advanced focus animation for header
const focusAnimation = {
  scale: [1, 1.02, 1],
  textShadow: [
    "0 0 0px rgba(99, 102, 241, 0)",
    "0 0 20px rgba(99, 102, 241, 0.8)",
    "0 0 0px rgba(99, 102, 241, 0)"
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Splash click effect component
const SplashClick: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clicks, setClicks] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setClicks(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== id));
    }, 1000);
  };

  return (
    <div className="relative" onClick={handleClick}>
      {children}
      {clicks.map(click => (
        <motion.div
          key={click.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute pointer-events-none"
          style={{
            left: click.x,
            top: click.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
};

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <SplashClick>
        <div className="glass-card p-8 h-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
            {title}
          </h3>
          <p className="text-white/70 leading-relaxed">
            {description}
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </SplashClick>
    </motion.div>
  );
};

// Animated Progress Circle Component
const CriteriaCircle: React.FC<CriteriaCircleProps> = ({ title, icon, score, maxScore, delay = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedScore(prev => {
            if (prev >= score) {
              clearInterval(interval);
              return score;
            }
            return prev + 0.1;
          });
        }, 50);
        return () => clearInterval(interval);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, score, delay]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center group"
    >
      <SplashClick>
        <div className="relative w-32 h-32 mb-4 cursor-pointer">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: isInView ? strokeDashoffset : circumference }}
              transition={{ duration: 2, delay: delay + 0.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <div className="text-2xl font-bold text-white">
                {animatedScore.toFixed(1)}
              </div>
              <div className="text-sm text-white/60">/ {maxScore}</div>
            </div>
          </div>
        </div>
      </SplashClick>
      <h4 className="text-lg font-semibold text-white text-center group-hover:text-indigo-300 transition-colors">
        {title}
      </h4>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role, company }) => {
  return (
    <div className="glass-card p-8 min-w-[350px] mx-4">
      <div className="flex items-start mb-6">
        <div className="text-4xl text-indigo-400 mr-4">"</div>
        <p className="text-white/90 text-lg leading-relaxed italic">
          {quote}
        </p>
      </div>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">
            {author.charAt(0)}
          </span>
        </div>
        <div>
          <div className="text-white font-semibold">{author}</div>
          <div className="text-white/60 text-sm">{role} @ {company}</div>
        </div>
      </div>
    </div>
  );
};

// Main Landing Page Component
const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Sample data
  const features = [
    {
      icon: <Lock className="w-8 h-8 text-white" />,
      title: "Encrypted Input",
      description: "Your pitch is AES-GCM encrypted client-side, so no one sees it. Complete privacy guaranteed with military-grade encryption."
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "AI Feedback",
      description: "Mistral LLM via OpenRouter, temperature 0.0 for deterministic scores. Get consistent, reliable insights every time."
    },
    {
      icon: <Receipt className="w-8 h-8 text-white" />,
      title: "Score Receipt",
      description: "SHA-256 hash proof ensures scoring integrity. Verify your results with cryptographic certainty."
    }
  ];

  const criteria = [
    {
      title: "Narrative Clarity",
      icon: <BookOpen className="w-4 h-4 text-white" />,
      score: 8.7,
      maxScore: 10
    },
    {
      title: "Originality",
      icon: <Palette className="w-4 h-4 text-white" />,
      score: 9.2,
      maxScore: 10
    },
    {
      title: "Team Strength",
      icon: <Users className="w-4 h-4 text-white" />,
      score: 7.8,
      maxScore: 10
    },
    {
      title: "Market Fit",
      icon: <Target className="w-4 h-4 text-white" />,
      score: 8.5,
      maxScore: 10
    }
  ];

  const testimonials = [
    {
      quote: "PitchGuard Lite transformed how we approach investor presentations. The AI insights were spot-on and helped us secure our Series A.",
      author: "Sarah Chen",
      role: "Co-Founder",
      company: "TechFlow"
    },
    {
      quote: "The privacy-first approach gave us confidence to test sensitive ideas. The scoring system is incredibly detailed and actionable.",
      author: "Marcus Rodriguez",
      role: "CEO",
      company: "GreenTech Solutions"
    },
    {
      quote: "Finally, an AI tool that understands the nuances of startup pitches. The feedback quality rivals top-tier accelerators.",
      author: "Emily Watson",
      role: "Founder",
      company: "HealthAI"
    }
  ];

  const benefits = [
    "Preserve privacy—no plain text stored",
    "Get instant, data-driven insights",
    "Stay confident with score receipts you can verify",
    "Military-grade encryption for sensitive data",
    "Deterministic AI scoring for consistency",
    "Comprehensive pitch analysis in seconds"
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <SplashClick>
          <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.h1
                animate={focusAnimation}
                className="text-6xl md:text-8xl font-bold mb-6 cursor-pointer"
              >
                <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                  PitchGuard
                </span>
                <br />
                <span className="text-4xl md:text-6xl bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Lite
                </span>
              </motion.h1>
              <motion.div
                animate={{
                  width: ["128px", "160px", "128px"],
                  boxShadow: [
                    "0 0 0px rgba(99, 102, 241, 0)",
                    "0 0 20px rgba(99, 102, 241, 0.6)",
                    "0 0 0px rgba(99, 102, 241, 0)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mb-8 rounded-full"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              AI-Powered Pitch Scoring • Encrypted & Private • Instant Feedback
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <SplashClick>
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Test Your Pitch
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </SplashClick>

              <SplashClick>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 glass-button text-white font-semibold text-lg flex items-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </SplashClick>
            </motion.div>

            {/* Advanced Hero Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16"
            >
              <SplashClick>
                <div className="relative max-w-4xl mx-auto">
                  <div className="glass-card p-8 transform perspective-1000 hover:rotate-y-6 transition-transform duration-500 cursor-pointer">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <motion.div
                        animate={{
                          opacity: [0.6, 1, 0.6],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        className="h-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      />
                      <motion.div
                        animate={{
                          opacity: [0.4, 1, 0.4],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                        className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                      <motion.div
                        animate={{
                          opacity: [0.8, 1, 0.8],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                        className="h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        animate={{ width: ["75%", "85%", "75%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-6 bg-white/20 rounded-lg"
                      />
                      <motion.div
                        animate={{ width: ["100%", "90%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        className="h-6 bg-white/15 rounded-lg"
                      />
                      <motion.div
                        animate={{ width: ["66%", "80%", "66%"] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                        className="h-6 bg-white/10 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </SplashClick>
            </motion.div>
          </div>
        </SplashClick>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Why Choose{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                PitchGuard Lite
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              Experience the future of pitch analysis with privacy-preserving AI technology
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Criteria Breakdown Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              How We Score Your{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Pitch
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              Our AI evaluates four critical dimensions of your pitch with precision and consistency
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {criteria.map((criterion, index) => (
              <CriteriaCircle
                key={index}
                title={criterion.title}
                icon={criterion.icon}
                score={criterion.score}
                maxScore={criterion.maxScore}
                delay={index * 0.3}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-white/60 text-lg">
              Each criterion is analyzed using advanced NLP and scored on a 10-point scale
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Showcase */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Advanced{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                AI Technology
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              Experience cutting-edge pitch analysis with enterprise-grade security
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative cursor-pointer"
              >
                <div className="glass-card p-6 h-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white/90 font-medium group-hover:text-white transition-colors">{benefit}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <SplashClick>
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Experience the Future
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </SplashClick>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Trusted by{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Founders
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-3xl mx-auto"
            >
              See what successful entrepreneurs say about PitchGuard Lite
            </motion.p>
          </motion.div>

          <div className="relative">
            <div className="flex justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-2xl"
                >
                  <TestimonialCard {...testimonials[currentTestimonial]} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <SplashClick>
                <motion.button
                  onClick={prevTestimonial}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 glass-button rounded-full flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
              </SplashClick>
              <SplashClick>
                <motion.button
                  onClick={nextTestimonial}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 glass-button rounded-full flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </SplashClick>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <SplashClick key={index}>
                  <button
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                </SplashClick>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-24 relative bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Elevate Your{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Pitch?
              </span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Join thousands of founders who trust PitchGuard Lite for privacy-preserving pitch analysis
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <SplashClick>
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-black font-bold text-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Get Early Access
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </SplashClick>

              <SplashClick>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-5 glass-button text-white font-semibold text-xl flex items-center gap-3"
                >
                  <Github className="w-6 h-6" />
                  View on GitHub
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </SplashClick>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* About Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">PitchGuard Lite</h3>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">
                Privacy-preserving AI pitch analysis for the modern founder.
                Secure, reliable, and built for the future of fundraising.
              </p>
              <div className="flex gap-4">
                <SplashClick>
                  <motion.a
                    href="https://github.com/Sagexd08/PitchGuard"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 glass-button rounded-full flex items-center justify-center"
                  >
                    <Github className="w-5 h-5 text-white" />
                  </motion.a>
                </SplashClick>
                <SplashClick>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 glass-button rounded-full flex items-center justify-center"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </motion.a>
                </SplashClick>
                <SplashClick>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 glass-button rounded-full flex items-center justify-center"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </motion.a>
                </SplashClick>
              </div>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Demo Video
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6">Contact</h4>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:hello@pitchguard.com" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    hello@pitchguard.com
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    @pitchguard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2025 PitchGuard Lite. Built with ❤️ for founders everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;