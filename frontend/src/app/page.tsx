'use client';

import React, { useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Brain, Shield, Settings, Crown, Github } from 'lucide-react';

// Lazy load heavy components
const LandingPage = lazy(() => import('../components/LandingPage'));

const ParticleBackground = lazy(() => import('../components/ParticleBackground'));
const ClickSpark = lazy(() => import('../components/ClickSpark'));
const PerformanceMonitor = lazy(() => import('../components/PerformanceMonitor'));
const Squares = lazy(() => import('../components/Squares'));

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
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ClickSpark>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
          {/* Background Elements - Lazy loaded */}
          <Suspense fallback={null}>
            <ParticleBackground />
          </Suspense>

          {/* Animated Square Background - Lazy loaded */}
          <Suspense fallback={null}>
            <Squares
              direction="diagonal"
              speed={0.3}
              borderColor="rgba(99, 102, 241, 0.08)"
              squareSize={60}
              hoverFillColor="rgba(99, 102, 241, 0.03)"
            />
          </Suspense>

          <div className="relative z-10">
            <main className="container mx-auto px-4 py-8">
              <Suspense fallback={
                <div className="text-white text-center py-20">
                  <div className="animate-pulse">Loading content...</div>
                </div>
              }>
                <LandingPage onGetStarted={handleGetStarted} />
              </Suspense>
            </main>

            {/* Dock Navigation */}
            <Dock items={createDockItems()} />

            {/* Performance Monitor - Only in development */}
            {process.env.NODE_ENV === 'development' && (
              <Suspense fallback={null}>
                <PerformanceMonitor
                  enabled={false}
                  showInProduction={false}
                  position="bottom-right"
                />
              </Suspense>
            )}


          </div>
        </div>
      </ClickSpark>
    </Suspense>
  );
}
