import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Brain, 
  Users, 
  Target, 
  Lightbulb, 
  Receipt, 
  Copy, 
  CheckCircle,
  Loader2,
  TrendingUp
} from 'lucide-react'

const ScoreDisplay = ({ scores, receipt, isLoading }) => {
  const [copiedReceipt, setCopiedReceipt] = useState(false)

  const copyReceipt = async () => {
    if (receipt) {
      await navigator.clipboard.writeText(receipt)
      setCopiedReceipt(true)
      setTimeout(() => setCopiedReceipt(false), 2000)
    }
  }

  const scoreConfig = [
    {
      key: 'clarity',
      label: 'Narrative Clarity',
      icon: Brain,
      color: 'blue',
      description: 'How clearly you communicate your story'
    },
    {
      key: 'originality',
      label: 'Originality',
      icon: Lightbulb,
      color: 'yellow',
      description: 'Uniqueness and innovation of your solution'
    },
    {
      key: 'team_strength',
      label: 'Team Strength',
      icon: Users,
      color: 'purple',
      description: 'Credibility and capability of your team'
    },
    {
      key: 'market_fit',
      label: 'Market Fit',
      icon: Target,
      color: 'green',
      description: 'Alignment with market needs and opportunity'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-blue-400 glow-blue',
      yellow: 'from-yellow-500 to-yellow-600 text-yellow-400 glow-yellow',
      purple: 'from-purple-500 to-purple-600 text-purple-400 glow-purple',
      green: 'from-green-500 to-green-600 text-green-400 glow-green'
    }
    return colors[color] || colors.blue
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    if (score >= 4) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Fair'
    return 'Needs Work'
  }

  const averageScore = scores ? 
    Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length : 0

  return (
    <motion.div
      className="glass rounded-2xl p-8 hover-lift"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center mb-6">
        <motion.div
          animate={{ 
            rotate: isLoading ? [0, 360] : 0,
            scale: scores ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" },
            scale: { duration: 0.5 }
          }}
        >
          <BarChart3 className="w-8 h-8 text-green-400 mr-3" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Pitch Analysis</h2>
        {scores && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto"
          >
            <TrendingUp className="w-6 h-6 text-green-400" />
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-12 h-12 text-blue-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Analyzing Your Pitch
            </h3>
            <p className="text-slate-400">
              Our AI is evaluating your pitch across multiple dimensions...
            </p>
            <motion.div
              className="mt-6 flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : scores ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8 p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600"
            >
              <h3 className="text-lg font-medium text-slate-300 mb-2">Overall Score</h3>
              <motion.div
                className={`text-4xl font-bold ${getScoreColor(averageScore)}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {averageScore.toFixed(1)}/10
              </motion.div>
              <p className={`text-sm font-medium ${getScoreColor(averageScore)}`}>
                {getScoreLabel(averageScore)}
              </p>
            </motion.div>

            {}
            <div className="space-y-4">
              {scoreConfig.map((config, index) => {
                const score = scores[config.key]
                const percentage = (score / 10) * 100

                return (
                  <motion.div
                    key={config.key}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <config.icon className={`w-5 h-5 mr-2 ${config.color === 'yellow' ? 'text-yellow-400' : 
                          config.color === 'purple' ? 'text-purple-400' :
                          config.color === 'green' ? 'text-green-400' : 'text-blue-400'}`} />
                        <span className="font-medium text-white">{config.label}</span>
                      </div>
                      <motion.span
                        className={`font-bold text-lg ${getScoreColor(score)}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        {score.toFixed(1)}
                      </motion.span>
                    </div>

                    <div className="relative">
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getColorClasses(config.color).split(' ').slice(0, 2).join(' ')} relative`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              delay: 1 + index * 0.1,
                              ease: "easeInOut"
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {config.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {}
            {receipt && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="border-t border-slate-600 pt-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Receipt className="w-5 h-5 text-slate-400 mr-2" />
                    <h3 className="font-medium text-slate-300">Score Receipt</h3>
                  </div>
                  <motion.button
                    onClick={copyReceipt}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedReceipt ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <code className="text-xs text-slate-300 break-all font-mono">
                    {receipt}
                  </code>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This cryptographic hash serves as proof of your scoring session and ensures result integrity.
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <BarChart3 className="w-16 h-16 text-slate-600 mx-auto" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              Ready for Analysis
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Submit your pitch to receive AI-powered scoring across four key dimensions
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ScoreDisplay
