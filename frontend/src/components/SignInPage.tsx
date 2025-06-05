import React from 'react';
import { SignIn, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Github, ExternalLink } from 'lucide-react';

interface SignInPageProps {
  onBack: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onBack }) => {
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
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          
          <p className="text-white/70 mb-6">
            You're successfully signed in to PitchGuard. Ready to analyze your pitch with privacy-preserving AI?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Continue to Dashboard
            </button>
            
            <button
              onClick={() => window.open('https://github.com/Sagexd08/PitchGuard', '_blank')}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
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
  );
};

export default SignInPage;
