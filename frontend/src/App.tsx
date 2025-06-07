import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

import LandingPage from './components/LandingPage';
import PitchAnalyzer from './components/PitchAnalyzer';
import SecurityPage from './components/SecurityPage';
import SettingsPage from './components/SettingsPage';
import PricingPage from './components/PricingPage';
import ProfilePopup from './components/ProfilePopup';
import AuthWrapper from './components/AuthWrapper';
import ParticleBackground from './components/ParticleBackground';
import Dock from './components/Dock';
import ClickSpark from './components/ClickSpark';
import PerformanceMonitor from './components/PerformanceMonitor';
import Squares from './components/Squares';

import { Home, Brain, Shield, Settings, Crown, Github } from 'lucide-react';

type AppPage = 'landing' | 'analyzer' | 'security' | 'settings' | 'pricing';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const { user } = useUser();

  const handleGetStarted = () => {
    setCurrentPage('analyzer');
  };

  const handleAnalysisComplete = (data: { scores: any; receipt: string }) => {
    console.log('Analysis completed:', data);
  };

  const createDockItems = () => {
    const baseItems = [
      {
        icon: <Home className="w-6 h-6" />,
        label: "Home",
        onClick: () => setCurrentPage('landing'),
      },
      {
        icon: <Brain className="w-6 h-6" />,
        label: "Analyzer",
        onClick: () => setCurrentPage('analyzer'),
      },
      {
        icon: <Shield className="w-6 h-6" />,
        label: "Security",
        onClick: () => setCurrentPage('security'),
      },
      {
        icon: <Settings className="w-6 h-6" />,
        label: "Settings",
        onClick: () => setCurrentPage('settings'),
      },
      {
        icon: <Crown className="w-6 h-6" />,
        label: "Pricing",
        onClick: () => setCurrentPage('pricing'),
      },

    ];

    baseItems.push({
      icon: user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {user?.fullName?.charAt(0) || user?.primaryEmailAddress?.emailAddress?.charAt(0) || 'U'}
        </div>
      ),
      label: "Profile",
      onClick: () => setIsProfilePopupOpen(true),
    });

    baseItems.push({
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      onClick: () => window.open('https:
    });

    return baseItems;
  };

  return (
    <ClickSpark>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden font-['Montserrat'] relative">
        {}
        <div className="fixed inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.4}
            borderColor="rgba(99, 102, 241, 0.12)"
            squareSize={55}
            hoverFillColor="rgba(99, 102, 241, 0.06)"
          />
        </div>

        <ParticleBackground />

        <div className="relative z-10">
          <main className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {currentPage === 'landing' && (
                <LandingPage onGetStarted={handleGetStarted} />
              )}
              {currentPage === 'analyzer' && (
                <PitchAnalyzer onAnalysisComplete={handleAnalysisComplete} />
              )}
              {currentPage === 'security' && (
                <SecurityPage />
              )}
              {currentPage === 'settings' && (
                <SettingsPage />
              )}
              {currentPage === 'pricing' && (
                <PricingPage />
              )}
            </AnimatePresence>
          </main>

          {}
          <Dock items={createDockItems()} />

          {}
          <PerformanceMonitor
            enabled={true}
            showInProduction={false}
            position="bottom-right"
          />

          {}
          <ProfilePopup
            isOpen={isProfilePopupOpen}
            onClose={() => setIsProfilePopupOpen(false)}
          />

          {}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#fff',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </div>
      </div>
    </ClickSpark>
  );
};

const App: React.FC = () => {
  return (
    <AuthWrapper>
      <AppContent />
    </AuthWrapper>
  );
};

export default App;
