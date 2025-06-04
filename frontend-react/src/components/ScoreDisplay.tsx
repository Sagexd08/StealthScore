import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RefreshCw, Copy, Check, Download, Share2 } from 'lucide-react'
import Confetti from 'react-confetti'
import toast from 'react-hot-toast'

interface ScoreDisplayProps {
  scores: {
    clarity: number
    originality: number
    team_strength: number
    market_fit: number
  }
  receipt: string
  onReset: () => void
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores, receipt, onReset }) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [copiedReceipt, setCopiedReceipt] = useState(false)

  const scoreItems = [
    { key: 'clarity', label: 'Narrative Clarity', color: 'from-blue-400 to-blue-600', icon: '📝' },
    { key: 'originality', label: 'Originality', color: 'from-green-400 to-green-600', icon: '💡' },
    { key: 'team_strength', label: 'Team Strength', color: 'from-purple-400 to-purple-600', icon: '👥' },
    { key: 'market_fit', label: 'Market Fit', color: 'from-orange-400 to-orange-600', icon: '🎯' },
  ]

  const averageScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 4
  const isExcellent = averageScore >= 8

  useEffect(() => {
    if (isExcellent) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [isExcellent])

  const copyReceipt = async () => {
    try {
      await navigator.clipboard.writeText(receipt)
      setCopiedReceipt(true)
      toast.success('Receipt copied to clipboard!')
      setTimeout(() => setCopiedReceipt(false), 2000)
    } catch (err) {
      toast.error('Failed to copy receipt')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Exceptional'
    if (score >= 8) return 'Excellent'
    if (score >= 7) return 'Good'
    if (score >= 6) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Trophy className="w-16 h-16 text-yellow-400" />
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white mb-2">
          Pitch Analysis Complete!
        </h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card inline-block px-6 py-3"
        >
          <p className="text-2xl font-bold text-gradient">
            Overall Score: {averageScore.toFixed(1)}/10
          </p>
          <p className={`text-sm ${getScoreColor(averageScore)}`}>
            {getScoreLabel(averageScore)}
          </p>
        </motion.div>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scoreItems.map((item, index) => {
          const score = scores[item.key as keyof typeof scores]
          const percentage = (score / 10) * 100
          
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`} />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold text-white">
                      {item.label}
                    </h3>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className={`text-2xl font-bold ${getScoreColor(score)}`}
                  >
                    {score.toFixed(1)}
                  </motion.div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${item.color} score-bar-glow`}
                  />
                </div>
                
                {/* Score Label */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className={`text-sm mt-2 ${getScoreColor(score)}`}
                >
                  {getScoreLabel(score)}
                </motion.p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Receipt Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          🧾 Score Receipt
          <span className="text-sm text-white/60 font-normal">
            (Cryptographic Proof)
          </span>
        </h3>
        
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60">Receipt Hash:</span>
            <motion.button
              onClick={copyReceipt}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button p-2 text-white/70 hover:text-white"
            >
              {copiedReceipt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
          <p className="text-blue-300 break-all leading-relaxed">
            {receipt}
          </p>
        </div>
        
        <p className="text-white/60 text-xs mt-3">
          This hash serves as cryptographic proof of your scoring session and cannot be forged.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button px-8 py-3 text-white hover:text-white flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Analyze Another Pitch
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 neon-glow"
        >
          <Download className="w-4 h-4" />
          Export Results
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button px-8 py-3 text-white hover:text-white flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Results
        </motion.button>
      </motion.div>
    </div>
  )
}

export default ScoreDisplay
