<<<<<<< HEAD
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import AuthWrapper from './components/AuthWrapper'
import LandingPage from './components/LandingPage'
import PitchAnalyzer from './components/PitchAnalyzer'
import SecurityPage from './components/SecurityPage'
import SettingsPage from './components/SettingsPage'
import ExportPage from './components/ExportPage'
import Navigation from './components/Navigation'
import Squares from './components/Squares'
import { useExportShare } from './hooks/useExportShare'

type ViewType = 'landing' | 'analyzer' | 'results' | 'security' | 'settings' | 'export'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing')
  const [analysisData, setAnalysisData] = useState<any>(null)
  const { generatePDF, shareResults, isExporting } = useExportShare()

  const handleGetStarted = () => {
    setCurrentView('analyzer')
  }

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setCurrentView('results')
  }

  const handleExport = () => {
    setCurrentView('export')
  }

  const handleSecurity = () => {
    setCurrentView('security')
  }

  const handleSettings = () => {
    setCurrentView('settings')
  }

  const handleHelp = () => {
    // Could open a help modal or navigate to help page
    console.log('Help requested')
  }

  return (
    <>
      {/* Global Squares Background */}
      <Squares
        direction="diagonal"
        speed={0.5}
        borderColor="rgba(59, 130, 246, 0.2)"
        squareSize={60}
        hoverFillColor="rgba(59, 130, 246, 0.1)"
      />

      <AuthWrapper>
        <div className="min-h-screen relative overflow-hidden z-10">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-20"
          >
          <AnimatePresence mode="wait">
            {currentView === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <LandingPage onGetStarted={handleGetStarted} />
              </motion.div>
            )}

            {currentView === 'analyzer' && (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen flex items-center justify-center px-4 py-8"
              >
                <PitchAnalyzer onAnalysisComplete={handleAnalysisComplete} />
              </motion.div>
            )}

            {currentView === 'results' && analysisData && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen flex items-center justify-center px-4 py-8"
              >
                <div className="max-w-6xl mx-auto">
                  {/* Results content will be rendered here */}
                  <div className="glass-card p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Analysis Complete!</h2>
                    <p className="text-white/70 mb-8">Your pitch has been analyzed successfully.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {Object.entries(analysisData.scores).map(([key, score]: [string, any]) => (
                        <div key={key} className="glass-card p-4">
                          <div className="text-2xl font-bold text-blue-400">{score.toFixed(1)}</div>
                          <div className="text-sm text-white/70 capitalize">{key.replace('_', ' ')}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleExport}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
                      >
                        Export & Share
                      </button>
                      <button
                        onClick={() => setCurrentView('analyzer')}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
                      >
                        Analyze Another
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <SecurityPage />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <SettingsPage />
              </motion.div>
            )}

            {currentView === 'export' && (
              <motion.div
                key="export"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <ExportPage analysisData={analysisData} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

          {/* Navigation Dock */}
          <Navigation
            currentView={currentView}
            onNavigate={setCurrentView}
            onExport={handleExport}
            onHelp={handleHelp}
            onSettings={handleSettings}
            onSecurity={handleSecurity}
          />

          {/* Toast Notifications */}
=======
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
import { Home, Brain, Shield, Settings, Crown, Trophy } from 'lucide-react';

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
      label: "Hackathon",
      onClick: () => setCurrentPage('hackathon'),
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
>>>>>>> e5c482e8 (feat: Complete OnlyFounders AI hackathon submission with full deployment pipeline)
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
<<<<<<< HEAD
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              },
            }}
          />
      </div>
    </AuthWrapper>
    </>
  )
}

export default App
=======
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
>>>>>>> e5c482e8 (feat: Complete OnlyFounders AI hackathon submission with full deployment pipeline)
