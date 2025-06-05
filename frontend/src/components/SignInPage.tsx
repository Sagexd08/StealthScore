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
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Sign In to PitchGuard
        </h1>
        
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Access your privacy-preserving AI pitch analysis dashboard
        </p>
      </div>

      {/* Sign In Component */}
      <div className="flex justify-center">
        <div className="glass-card p-8 w-full max-w-md">
          <SignIn 
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#3b82f6',
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
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#ffffff',
                },
                formButtonPrimary: {
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                },
                footerActionLink: {
                  color: '#3b82f6',
                },
              },
            }}
            redirectUrl="/dashboard"
            signUpUrl="/signup"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-white/50 mb-4">
          New to PitchGuard? Privacy-first AI pitch analysis awaits.
        </p>
        
        <button
          onClick={() => window.open('https://github.com/Sagexd08/PitchGuard', '_blank')}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Github className="w-4 h-4" />
          Open Source on GitHub
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default SignInPage;
