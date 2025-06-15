'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, Brain, Shield, Settings, Crown, Github } from 'lucide-react';

// Direct imports for immediate loading
import LandingPage from '../components/LandingPage';
import ParticleBackground from '../components/ParticleBackground';
import ClickSpark from '../components/ClickSpark';
import PerformanceMonitor from '../components/PerformanceMonitor';
import Squares from '../components/Squares';
import Dock from '../components/Dock';

export default function HomePage() {

  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/analyzer');
  };

  const createDockItems = () => [
    {
      id: 'home',
      icon: <Home className="w-6 h-6" />,
      label: 'Home',
      onClick: () => router.push('/'),
      active: true,
    },
    {
      id: 'analyzer',
      icon: <Brain className="w-6 h-6" />,
      label: 'Analyzer',
      onClick: () => router.push('/analyzer'),
      active: false,
    },
    {
      id: 'security',
      icon: <Shield className="w-6 h-6" />,
      label: 'Security',
      onClick: () => router.push('/security'),
      active: false,
    },
    {
      id: 'settings',
      icon: <Settings className="w-6 h-6" />,
      label: 'Settings',
      onClick: () => router.push('/settings'),
      active: false,
    },
    {
      id: 'pricing',
      icon: <Crown className="w-6 h-6" />,
      label: 'Pricing',
      onClick: () => router.push('/pricing'),
      active: false,
    },
    {
      id: 'github',
      icon: <Github className="w-6 h-6" />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com/Sagexd08/StealthScore', '_blank'),
      active: false,
    },
  ];

  return (
    <ClickSpark>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Background Elements */}
        <ParticleBackground />

        {/* Animated Square Background */}
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(99, 102, 241, 0.08)"
          squareSize={60}
          hoverFillColor="rgba(99, 102, 241, 0.03)"
        />

        <div className="relative z-10">
          <main className="container mx-auto px-4 py-8">
            <LandingPage onGetStarted={handleGetStarted} />
          </main>

          {/* Dock Navigation */}
          <Dock items={createDockItems()} />

          {/* Performance Monitor - Only in development */}
          {process.env.NODE_ENV === 'development' && (
            <PerformanceMonitor
              enabled={false}
              showInProduction={false}
              position="bottom-right"
            />
          )}
        </div>
      </div>
    </ClickSpark>
  );
}
