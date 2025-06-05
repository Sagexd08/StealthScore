import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Components
import LandingPage from './components/LandingPage';
import PitchAnalyzer from './components/PitchAnalyzer';
import SecurityPage from './components/SecurityPage';
import SettingsPage from './components/SettingsPage';
import PricingPage from './components/PricingPage';
import HackathonShowcase from './components/HackathonShowcase';
import ParticleBackground from './components/ParticleBackground';
import Dock from './components/Dock';
import ClickSpark from './components/ClickSpark';

// Icons
import { Home, Brain, Shield, Settings, Crown, Trophy, Github } from 'lucide-react';

// Types
type AppPage = 'landing' | 'analyzer' | 'security' | 'settings' | 'pricing' | 'hackathon';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');

  const handleGetStarted = () => {
    setCurrentPage('analyzer');
  };

  const handleAnalysisComplete = (data: { scores: any; receipt: string }) => {
    console.log('Analysis completed:', data);
  };

  const dockItems = [
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
    {
      icon: <Trophy className="w-6 h-6" />,
      label: "Milestone Demos",
      onClick: () => setCurrentPage('hackathon'),
    },
    {
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      onClick: () => window.open('https://github.com/Sagexd08/PitchGuard', '_blank'),
    },
  ];

  return (
    <ClickSpark>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
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
              {currentPage === 'hackathon' && (
                <HackathonShowcase />
              )}
            </AnimatePresence>
          </main>

          {/* Dock Navigation */}
          <Dock items={dockItems} />

          {/* Global Components */}
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

export default App;
