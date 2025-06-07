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
  ExternalLink,
  Fingerprint,
  Database,
  Server,
  Code,
  Cpu,
  Network,
  Key,
  Layers,
  Eye,
  Award,
  TrendingUp,
  Rocket,

  Gem,
  Crown,
  Infinity,
  Atom,
  Binary,
  Blocks,
  Bot,
  Braces,
  CircuitBoard,
  Cog,
  Command,
  Compass,
  Download,
  FileCheck,
  Filter,
  Flame,
  Gauge,
  GitBranch,
  Hexagon,
  Layers3,
  LineChart,
  Microscope,
  Monitor,
  MousePointer,
  Orbit,
  Radar,
  Scan,
  Search,
  Settings,
  Smartphone,
  Sparkle,
  Timer,
  Wand2,
  Workflow,
  Wrench
} from 'lucide-react';

import TrueFocus from './TrueFocus';
import SplitText from './SplitText';
import ClickSpark from './ClickSpark';
import AnimatedProgressCard from './AnimatedProgressCard';
import Squares from './Squares';
import Floating3DBackground from './Floating3DBackground';
import EnhancedFeatureCard from './EnhancedFeatureCard';
import EnhancedSectionHeader from './EnhancedSectionHeader';
import TestYourPitchCards from './TestYourPitchCards';

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

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <Lock className="w-8 h-8 text-white" />,
      title: "AES-256 Encryption",
      description: "Your pitch is protected with AES-256-GCM encryption client-side. Military-grade security ensures complete privacy and data protection."
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "Advanced AI Analysis",
      description: "Powered by Mistral LLM via OpenRouter with temperature 0.0 for deterministic scoring. Get consistent, reliable insights every time."
    },
    {
      icon: <Receipt className="w-8 h-8 text-white" />,
      title: "Cryptographic Verification",
      description: "SHA-256 hash proof ensures scoring integrity and authenticity. Verify your results with mathematical certainty."
    }
  ];

  const featuredCards = [
    {
      icon: <Rocket className="w-8 h-8 text-white" />,
      title: "Lightning Fast",
      description: "Get comprehensive pitch analysis in under 30 seconds with our optimized AI pipeline.",
      gradient: "from-blue-500 to-cyan-500",
      stats: "< 30s"
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Zero-Knowledge",
      description: "Your data never leaves your device in plain text. Complete privacy by design.",
      gradient: "from-green-500 to-emerald-500",
      stats: "100% Private"
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Real-time Insights",
      description: "Instant feedback on narrative clarity, market fit, and investor appeal.",
      gradient: "from-purple-500 to-pink-500",
      stats: "Live Analysis"
    },
    {
      icon: <Gem className="w-8 h-8 text-white" />,
      title: "Premium Quality",
      description: "Enterprise-grade analysis that rivals top-tier accelerator feedback.",
      gradient: "from-orange-500 to-red-500",
      stats: "99.9% Accuracy"
    },
    {
      icon: <Crown className="w-8 h-8 text-white" />,
      title: "Founder-First",
      description: "Built by founders, for founders. We understand your unique challenges.",
      gradient: "from-yellow-500 to-orange-500",
      stats: "By Founders"
    },
    {
      icon: <Infinity className="w-8 h-8 text-white" />,
      title: "Unlimited Potential",
      description: "No limits on iterations. Perfect your pitch with unlimited analysis runs.",
      gradient: "from-indigo-500 to-purple-500",
      stats: "∞ Iterations"
    }
  ];

  const metrics = [
    {
      icon: <Gauge className="w-8 h-8 text-white" />,
      value: "99.9%",
      label: "Uptime",
      description: "Enterprise reliability"
    },
    {
      icon: <Timer className="w-8 h-8 text-white" />,
      value: "< 30s",
      label: "Analysis Time",
      description: "Lightning fast results"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      value: "10K+",
      label: "Founders",
      description: "Trust our platform"
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      value: "4.9/5",
      label: "Rating",
      description: "User satisfaction"
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
      quote: "Stealth Score transformed how we approach investor presentations. The AI insights were spot-on and helped us secure our Series A.",
      author: "Sarah Chen",
      role: "Co-Founder",
      company: "TechFlow"
    },
    {
      quote: "The privacy-first approach gave us confidence to test sensitive ideas. The AES-256 encryption and scoring system are incredibly detailed.",
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
    "AES-256 encryption—no plain text stored anywhere",
    "Get instant, data-driven insights in real-time",
    "Cryptographic score receipts you can verify",
    "Military-grade security for sensitive data",
    "Deterministic AI scoring for consistency",
    "Comprehensive pitch analysis in under 30 seconds"
  ];

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
    <div className="min-h-screen relative font-['Montserrat']">
      {}
      <Squares
        direction="diagonal"
        speed={0.5}
        borderColor="rgba(99, 102, 241, 0.1)"
        squareSize={60}
        hoverFillColor="rgba(99, 102, 241, 0.05)"
      />

      {}
      <Floating3DBackground>
        <div className="opacity-30" />
      </Floating3DBackground>

      {}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-10">
        {}
        <div className="absolute inset-0">
          {}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-500/25 to-purple-600/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }} />

          {}
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-rose-500/15 to-orange-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />

          {}
          <div className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-r from-yellow-500/12 to-amber-500/12 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '5s' }} />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-gradient-to-r from-violet-500/12 to-purple-500/12 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '7s' }} />
          <div className="absolute top-1/3 left-10 w-40 h-40 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '8s' }} />
          <div className="absolute bottom-1/3 right-10 w-44 h-44 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '9s' }} />

          {}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/4 left-1/3 w-32 h-32 border border-indigo-400/20 rounded-lg backdrop-blur-sm"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            className="absolute bottom-1/4 right-1/3 w-24 h-24 border border-purple-400/20 rounded-full backdrop-blur-sm"
          />
        </div>

        <SplashClick>
          <div className="relative z-10 text-center max-w-8xl mx-auto px-4">
            {}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-16"
            >
              {}
              <div className="mb-12 relative">
                {}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full scale-150"></div>

                <TrueFocus
                  sentence="Stealth Score"
                  manualMode={false}
                  blurAmount={6}
                  borderColor="#6366f1"
                  animationDuration={3}
                  pauseBetweenAnimations={6}
                />

                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="mt-6"
                >
                  <p className="text-2xl md:text-3xl font-light text-white/90 tracking-wide">
                    The Future of <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">Privacy-First</span> Fundraising
                  </p>
                </motion.div>
              </div>

              {}
              <motion.div
                animate={{
                  width: ["120px", "300px", "120px"],
                  boxShadow: [
                    "0 0 0px rgba(99, 102, 241, 0)",
                    "0 0 50px rgba(99, 102, 241, 0.9)",
                    "0 0 0px rgba(99, 102, 241, 0)"
                  ],
                  background: [
                    "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                    "linear-gradient(90deg, #ec4899, #6366f1, #8b5cf6)",
                    "linear-gradient(90deg, #8b5cf6, #ec4899, #6366f1)"
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }}
                className="h-2 mx-auto mb-12 rounded-full"
              />
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="mb-20"
            >
              <SplitText
                text="Revolutionary AI-Powered Pitch Analysis • Military-Grade AES-256 Encryption • Real-Time Feedback & Insights • Web3-Native Architecture"
                className="text-2xl md:text-4xl text-white/95 max-w-6xl mx-auto leading-relaxed font-light tracking-wide"
                delay={35}
                duration={1.2}
                splitType="words"
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
              />

              {}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="flex flex-wrap justify-center gap-4 mt-12"
              >
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 backdrop-blur-sm">
                  <Lock className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Zero-Knowledge Privacy</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">Lightning Fast AI</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Web3 Integration</span>
                </div>
              </motion.div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.8 }}
              className="flex flex-col xl:flex-row gap-10 justify-center items-center mb-24"
            >
              {}
              <ClickSpark>
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.1, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-20 py-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-full text-white font-bold text-2xl shadow-2xl hover:shadow-indigo-500/40 transition-all duration-700 transform-gpu"
                >
                  {}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-xl scale-110 transition-all duration-700" />

                  <span className="relative z-10 flex items-center gap-5">
                    <Rocket className="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" />
                    Test Your Pitch Now
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-500" />
                  </span>
                </motion.button>
              </ClickSpark>

              {}
              <div className="flex flex-col lg:flex-row gap-6">
                <ClickSpark>
                  <motion.div
                    whileHover={{ scale: 1.08, rotateY: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group glass-card p-8 cursor-pointer hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 border border-green-500/20 hover:border-green-400/40 transform-gpu"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                          100% Private
                        </h3>
                        <p className="text-white/80 text-base">
                          Zero-knowledge architecture
                        </p>
                      </div>
                    </div>
                    {}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </ClickSpark>

                <ClickSpark>
                  <motion.div
                    whileHover={{ scale: 1.08, rotateY: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group glass-card p-8 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 border border-blue-500/20 hover:border-blue-400/40 transform-gpu"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                          Lightning Fast
                        </h3>
                        <p className="text-white/80 text-base">
                          Results in under 30s
                        </p>
                      </div>
                    </div>
                    {}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </ClickSpark>

                <ClickSpark>
                  <motion.div
                    whileHover={{ scale: 1.08, rotateY: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group glass-card p-8 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 border border-purple-500/20 hover:border-purple-400/40 transform-gpu"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                          AI-Powered
                        </h3>
                        <p className="text-white/80 text-base">
                          Advanced ML insights
                        </p>
                      </div>
                    </div>
                    {}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </ClickSpark>
              </div>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 2.2, ease: "easeOut" }}
              className="relative mt-16"
            >
              {}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-3xl blur-xl scale-125 animate-pulse"></div>

              {}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <AnimatedProgressCard />
              </div>

              {}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-70 blur-sm"
              />

              <motion.div
                animate={{
                  rotate: -360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-60 blur-sm"
              />
            </motion.div>
          </div>
        </SplashClick>
      </section>

      {}
      <section className="py-32 relative z-10">
        {}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative">
          <EnhancedSectionHeader
            subtitle="🎯 What Are Our Core Features?"
            title="Revolutionary Pitch Analysis Platform"
            description="Experience the future of fundraising with military-grade security, AI precision, and real-time insights that transform how founders present their vision"
            gradient="from-indigo-400 via-purple-400 to-pink-400"
            className="mb-20"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative perspective-1000"
              >
                <SplashClick>
                  <div className="glass-card p-10 h-full hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/25 cursor-pointer relative overflow-hidden border border-white/10 hover:border-indigo-400/30 transform-gpu">
                    {}
                    <Floating3DBackground>
                      <div className="opacity-30" />
                    </Floating3DBackground>

                    {}
                    <div className="absolute inset-0 opacity-20">
                      <Floating3DBackground>
                        <div className="opacity-50" />
                      </Floating3DBackground>
                    </div>

                    {}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.3, 0.1]
                      }}
                      transition={{
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute top-4 right-4 w-8 h-8 border border-indigo-400/30 rounded-lg"
                    />

                    {}
                    <div className="relative mb-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 shadow-xl">
                        {feature.icon}
                      </div>
                      {}
                      <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-md transform translate-x-2 translate-y-2" />
                    </div>

                    {}
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-indigo-300 transition-colors relative z-10 leading-tight group-hover:drop-shadow-lg">
                      {feature.title}
                    </h3>

                    {}
                    <p className="text-white/80 leading-relaxed relative z-10 text-lg group-hover:text-white/90 transition-colors">
                      {feature.description}
                    </p>

                    {}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-purple-500/8 to-pink-500/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-20 blur-sm"></div>
                    </div>

                    {}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
                  </div>
                </SplashClick>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-32 relative z-10 bg-gradient-to-b from-transparent via-purple-900/8 to-transparent">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
              opacity: [0.03, 0.12, 0.03]
            }}
            transition={{
              rotate: { duration: 35, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 },
              opacity: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }}
            className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <EnhancedSectionHeader
            subtitle="💎 What Premium Features Do We Offer?"
            title="Advanced Capabilities That Set Us Apart"
            description="Discover the cutting-edge features that make Stealth Score the ultimate pitch analysis platform for ambitious founders and innovative startups"
            gradient="from-purple-400 via-pink-400 to-red-400"
            className="mb-20"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: index * 0.12, type: "spring", bounce: 0.3 }}
                className="group relative cursor-pointer perspective-1000"
              >
                <SplashClick>
                  <div className="glass-card p-10 h-full hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 relative overflow-hidden border border-white/10 hover:border-purple-400/40 transform-gpu">
                    {}
                    <Floating3DBackground>
                      <div className="opacity-25" />
                    </Floating3DBackground>

                    {}
                    <div className="absolute inset-0 opacity-15">
                      <Floating3DBackground>
                        <div className="opacity-60" />
                      </Floating3DBackground>
                    </div>

                    {}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.15, 1],
                        opacity: [0.1, 0.4, 0.1]
                      }}
                      transition={{
                        rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute top-4 right-4 w-10 h-10 border border-purple-400/30 rounded-xl backdrop-blur-sm"
                    />

                    <motion.div
                      animate={{
                        rotate: [0, -360],
                        scale: [1, 1.2, 1],
                        opacity: [0.08, 0.3, 0.08]
                      }}
                      transition={{
                        rotate: { duration: 22, repeat: Infinity, ease: "linear" },
                        scale: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
                        opacity: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                      }}
                      className="absolute bottom-4 left-4 w-8 h-8 border border-pink-400/25 rounded-full backdrop-blur-sm"
                    />

                    {}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="relative">
                        <div className={`w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl relative z-10`}>
                          {card.icon}
                        </div>
                        {}
                        <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500 blur-lg transform translate-x-3 translate-y-3`} />
                      </div>
                      <div className={`px-5 py-3 bg-gradient-to-r ${card.gradient} rounded-full text-sm font-bold text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}>
                        {card.stats}
                      </div>
                    </div>

                    {}
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-purple-300 transition-colors relative z-10 leading-tight group-hover:drop-shadow-xl">
                      {card.title}
                    </h3>

                    {}
                    <p className="text-white/80 leading-relaxed mb-6 relative z-10 text-lg group-hover:text-white/95 transition-colors">
                      {card.description}
                    </p>

                    {}
                    <div className="flex items-center text-purple-300 text-sm font-semibold group-hover:text-white transition-colors relative z-10 group-hover:translate-x-3 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5 mr-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                      Explore Feature
                    </div>

                    {}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-12 transition-opacity duration-500 rounded-2xl`} />

                    {}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.gradient} opacity-25 blur-md`}></div>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.gradient} opacity-15 blur-xl scale-105`}></div>
                    </div>

                    {}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
                    <div className="absolute top-1/2 left-4 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-pulse" />
                  </div>
                </SplashClick>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-32 relative z-10 bg-gradient-to-b from-transparent via-blue-900/8 to-transparent">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.3, 1],
              opacity: [0.04, 0.12, 0.04]
            }}
            transition={{
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/8 to-green-500/8 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.4, 1],
              opacity: [0.03, 0.10, 0.03]
            }}
            transition={{
              rotate: { duration: 45, repeat: Infinity, ease: "linear" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 },
              opacity: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }
            }}
            className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/6 to-blue-500/6 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <EnhancedSectionHeader
            subtitle="📈 How Fast Is Our Platform?"
            title="Performance Metrics That Define Excellence"
            description="Real-world performance data from thousands of successful founders who trust Stealth Score for their most critical pitch analysis needs"
            gradient="from-green-400 via-blue-400 to-purple-400"
            className="mb-20"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.7, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.15, type: "spring", bounce: 0.4 }}
                className="text-center group perspective-1000"
              >
                <SplashClick>
                  <div className="glass-card p-10 hover:scale-115 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 relative overflow-hidden border border-white/10 hover:border-blue-400/40 transform-gpu">
                    {}
                    <Floating3DBackground>
                      <div className="opacity-30" />
                    </Floating3DBackground>

                    {}
                    <div className="absolute inset-0 opacity-20">
                      <Floating3DBackground>
                        <div className="opacity-70" />
                      </Floating3DBackground>
                    </div>

                    {}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.5, 0.1]
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute top-3 right-3 w-12 h-12 border border-blue-400/30 rounded-2xl backdrop-blur-sm"
                    />

                    {}
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-115 group-hover:rotate-12 transition-all duration-500 relative z-10 shadow-2xl">
                        {metric.icon}
                      </div>
                      {}
                      <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 rounded-3xl mx-auto opacity-0 group-hover:opacity-40 group-hover:scale-130 transition-all duration-500 blur-lg transform translate-x-2 translate-y-2" />
                      <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 rounded-3xl mx-auto opacity-0 group-hover:opacity-20 group-hover:scale-140 transition-all duration-700 blur-xl transform translate-x-4 translate-y-4" />
                    </div>

                    {}
                    <div className="text-6xl font-black text-white mb-4 group-hover:text-blue-300 transition-colors relative z-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 group-hover:drop-shadow-2xl">
                      {metric.value}
                    </div>

                    {}
                    <div className="text-xl font-bold text-blue-300 mb-3 relative z-10 group-hover:text-white transition-colors group-hover:scale-105 transition-transform duration-300">
                      {metric.label}
                    </div>

                    {}
                    <div className="text-white/80 text-sm relative z-10 leading-relaxed group-hover:text-white/95 transition-colors">
                      {metric.description}
                    </div>

                    {}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-green-500/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 opacity-25 blur-sm"></div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-15 blur-md scale-105"></div>
                    </div>

                    {}
                    <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
                    <div className="absolute top-1/2 right-3 w-2 h-2 bg-gradient-to-r from-purple-400 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-600 animate-pulse" />
                    <div className="absolute bottom-1/2 left-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-800 animate-pulse" />
                  </div>
                </SplashClick>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <SplitText
              text="When does a startup die? When it runs out of funding? No! When the market shifts? No! When the team gives up? No! A startup dies when its pitch is forgotten! Transform your pitch with AI-powered analysis."
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              delay={30}
              duration={0.8}
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            />
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-medium">Military-Grade Encryption</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-medium">Real-Time AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-medium">Zero Data Storage</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 font-medium">Advanced Animations</span>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <ClickSpark>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold flex items-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  Start Analysis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </ClickSpark>
              <ClickSpark>
                <motion.a
                  href="https:
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-3 glass-button text-white font-semibold flex items-center gap-3"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </ClickSpark>
              <ClickSpark>
                <motion.a
                  href="https:
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-3 glass-button text-white font-semibold flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5" />
                  Learn More
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </ClickSpark>
            </motion.div>
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

      {}
      <section className="py-24 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative z-20">
          <TestYourPitchCards />
        </div>
      </section>

      {}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <EnhancedSectionHeader
            subtitle="🗣️ What Do Our Users Say?"
            title="Trusted by Founders"
            description="See what successful entrepreneurs and industry leaders say about Stealth Score"
            gradient="from-yellow-400 via-orange-400 to-red-400"
            className="mb-16"
          />

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

            {}
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

            {}
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

      {}
      <section className="py-24 relative bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 z-10">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <EnhancedSectionHeader
              title="Ready to Elevate Your Pitch?"
              gradient="from-yellow-300 via-orange-300 to-red-300"
              centered={true}
              className="mb-8"
            />
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Join thousands of founders who trust Stealth Score for privacy-preserving pitch analysis
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
                <motion.a
                  href="https:
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-5 glass-button text-white font-semibold text-xl flex items-center gap-3"
                >
                  <Github className="w-6 h-6" />
                  View on GitHub
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.a>
              </SplashClick>
            </div>
          </motion.div>
        </div>
      </section>

      {}
      <footer className="py-16 bg-slate-900/50 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Stealth Score</h3>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">
                Privacy-preserving AI pitch analysis with AES-256 encryption for the modern founder.
                Secure, reliable, and built for the future of fundraising.
              </p>
              <div className="flex gap-4">
                <SplashClick>
                  <motion.a
                    href="https:
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

            {}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https:
                    <BookOpen className="w-4 h-4" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https:
                    <Play className="w-4 h-4" />
                    Demo Video
                  </a>
                </li>
                <li>
                  <a href="https:
                    <Globe className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https:
                    <Shield className="w-4 h-4" />
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6">Contact</h4>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:hello@stealthscore.ai" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    hello@stealthscore.ai
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    @stealthscore
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

          {}
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2025 Stealth Score. Empowering founders everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
