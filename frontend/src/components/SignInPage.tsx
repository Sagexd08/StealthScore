import React, { useState, useEffect } from 'react';
import { SignIn, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, Github, ExternalLink, Lock, Zap, Eye, Sparkles, Star, Users, TrendingUp } from 'lucide-react';
import Squares from './Squares';

interface SignInPageProps {
  onBack: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onBack }) => {
  const { isSignedIn, user } = useUser();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Lock,
      title: "Military-Grade Security",
      description: "AES-256 encryption protects your sensitive business data",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Analysis",
      description: "Get comprehensive pitch feedback in under 2 seconds",
      color: "from-blue-400 to-cyan-600"
    },
    {
      icon: Eye,
      title: "Privacy-First Design",
      description: "Zero data storage - your pitch never leaves your device",
      color: "from-purple-400 to-violet-600"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Advanced neural networks provide actionable recommendations",
      color: "from-yellow-400 to-orange-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Pitches Analyzed", icon: TrendingUp },
    { number: "95%", label: "Success Rate", icon: Star },
    { number: "50+", label: "Countries", icon: Users }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="glass-card p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Welcome back, {user?.firstName || 'User'}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 mb-6"
          >
            You're successfully signed in to StealthScore. Ready to analyze your pitch with privacy-preserving AI?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Continue to Dashboard
            </motion.button>

            <motion.button
              onClick={() => window.open('https://github.com/Sagexd08/PitchGuard', '_blank')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 glass-button px-6 py-3 text-white hover:text-white"
            >
              <Github className="w-5 h-5" />
              View Source
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Animated Square Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(59, 130, 246, 0.08)"
          squareSize={50}
          hoverFillColor="rgba(59, 130, 246, 0.04)"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto relative z-10 p-4"
      >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      {/* Enhanced Sign In Card */}
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl blur-xl transform scale-105"></div>

        {/* Main card with enhanced opacity */}
        <div className="relative bg-slate-900/95 backdrop-filter backdrop-blur-2xl border border-white/30 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>

            <p className="text-white/70 text-sm">
              Sign in to access your secure AI dashboard
            </p>
          </div>

          {/* Sign In Component */}
          <SignIn
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#3b82f6',
                colorBackground: 'transparent',
                colorInputBackground: 'rgba(30, 41, 59, 0.8)',
                colorInputText: '#ffffff',
                colorText: '#ffffff',
                colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.75rem',
                fontSize: '14px',
              },
              elements: {
                card: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '0',
                },
                headerTitle: {
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600',
                },
                headerSubtitle: {
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                },
                socialButtonsBlockButton: {
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#ffffff',
                  borderRadius: '0.75rem',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                formButtonPrimary: {
                  backgroundColor: '#3b82f6',
                  borderRadius: '0.75rem',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                },
                formFieldInput: {
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '12px',
                  fontSize: '14px',
                },
                footerActionLink: {
                  color: '#3b82f6',
                  fontSize: '14px',
                },
              },
            }}
            redirectUrl="/dashboard"
            signUpUrl="/signup"
          />

          {/* Enhanced Footer inside card */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/60 text-xs text-center mb-4">
              New to PitchGuard? Experience privacy-first AI analysis.
            </p>

            <button
              onClick={() => window.open('https://github.com/Sagexd08/PitchGuard', '_blank')}
              className="w-full inline-flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm py-2 px-4 rounded-lg hover:bg-blue-500/10"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;
