import React from 'react';
import { SignUp, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Github, ExternalLink, Sparkles, Lock, Zap } from 'lucide-react';
import Squares from './Squares';

interface SignUpPageProps {
  onBack: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onBack }) => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="glass-card p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to PitchGuard, {user?.firstName || 'User'}!
          </h1>
          
          <p className="text-white/70 mb-6">
            Your account has been created successfully. You now have access to privacy-preserving AI pitch analysis.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4">
              <Lock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm">Privacy First</p>
            </div>
            <div className="glass-card p-4">
              <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm">AI Powered</p>
            </div>
            <div className="glass-card p-4">
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-white/80 text-sm">Secure Analysis</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Start Analyzing Pitches
            </button>
            
            <button
              onClick={() => window.open('https:
              className="flex items-center gap-2 glass-button px-6 py-3 text-white hover:text-white"
            >
              <Github className="w-5 h-5" />
              View Source
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(139, 92, 246, 0.08)"
          squareSize={50}
          hoverFillColor="rgba(139, 92, 246, 0.04)"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10 p-4"
      >
      {}
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        
        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
          Join PitchGuard
        </h1>
        
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
          Create your account and start analyzing pitches with privacy-preserving AI
        </p>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <div className="glass-card p-4">
            <Lock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Privacy First</h3>
            <p className="text-white/60 text-sm">Your data stays private with TEE and ZK proofs</p>
          </div>
          <div className="glass-card p-4">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">AI Powered</h3>
            <p className="text-white/60 text-sm">Advanced AI analysis with federated learning</p>
          </div>
          <div className="glass-card p-4">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Secure</h3>
            <p className="text-white/60 text-sm">Enterprise-grade security and encryption</p>
          </div>
        </div>
      </div>

      {}
      <div className="flex justify-center">
        <div className="glass-card p-8 w-full max-w-md">
          <SignUp 
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#8b5cf6',
                colorBackground: 'rgba(15, 23, 42, 0.8)',
                colorInputBackground: 'rgba(30, 41, 59, 0.5)',
                colorInputText: '#ffffff',
                colorText: '#ffffff',
                colorTextSecondary: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '0.5rem',
              },
              elements: {
                card: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                },
                headerTitle: {
                  color: '#ffffff',
                },
                headerSubtitle: {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                socialButtonsBlockButton: {
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#ffffff',
                },
                formButtonPrimary: {
                  backgroundColor: '#8b5cf6',
                  '&:hover': {
                    backgroundColor: '#7c3aed',
                  },
                },
                footerActionLink: {
                  color: '#8b5cf6',
                },
              },
            }}
            redirectUrl="/dashboard"
            signInUrl="/signin"
          />
        </div>
      </div>

      {}
      <div className="text-center mt-8">
        <p className="text-white/50 mb-4">
          Already have an account? Sign in to continue your pitch analysis journey.
        </p>
        
        <button
          onClick={() => window.open('https:
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Github className="w-4 h-4" />
          Open Source on GitHub
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
