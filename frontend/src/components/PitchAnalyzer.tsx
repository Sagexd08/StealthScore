import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PitchInput from './PitchInput'
import ScoreDisplay from './ScoreDisplay'
import LoadingAnimation from './LoadingAnimation'
import { usePitchAnalysis } from '../hooks/usePitchAnalysis'

interface PitchAnalyzerProps {
  onAnalysisComplete?: (data: { scores: any; receipt: string }) => void
}

const PitchAnalyzer: React.FC<PitchAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'analyzing' | 'results'>('input')
  const { analyzePitch, isLoading, scores, receipt, error } = usePitchAnalysis()

  const handlePitchSubmit = async (pitchText: string) => {
    setCurrentStep('analyzing')

    try {
      await analyzePitch(pitchText)
      setCurrentStep('results')

      // Notify parent component
      if (onAnalysisComplete && scores && receipt) {
        onAnalysisComplete({ scores, receipt })
      }
    } catch (err) {
      setCurrentStep('input')
    }
  }

  const handleReset = () => {
    setCurrentStep('input')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            <PitchInput onSubmit={handlePitchSubmit} isLoading={isLoading} error={error} />
          </motion.div>
        )}

        {currentStep === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
          >
            <LoadingAnimation />
          </motion.div>
        )}

        {currentStep === 'results' && scores && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            <ScoreDisplay 
              scores={scores} 
              receipt={receipt} 
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PitchAnalyzer
