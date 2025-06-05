import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, FileText, AlertCircle, Loader2, Sparkles } from 'lucide-react'

const PitchForm = ({ onSubmit, isLoading, error }) => {
  const [pitchText, setPitchText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)

  const handleTextChange = (e) => {
    const text = e.target.value
    setPitchText(text)
    setCharCount(text.length)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pitchText.trim().length < 50) {
      return
    }
    onSubmit(pitchText.trim())
  }

  const isValid = pitchText.trim().length >= 50
  const isOptimal = charCount >= 200

  return (
    <motion.div
      className="glass rounded-2xl p-8 hover-lift"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center mb-6">
        <motion.div
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
        >
          <FileText className="w-8 h-8 text-blue-400 mr-3" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Submit Your Pitch</h2>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="ml-auto"
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label 
            htmlFor="pitchText" 
            className="block text-sm font-medium text-slate-300 mb-3"
          >
            Pitch Content
          </label>
          
          <motion.div
            className={`relative rounded-lg transition-all duration-300 ${
              isFocused ? 'ring-2 ring-blue-400 glow-blue' : ''
            }`}
            animate={{ 
              borderColor: isFocused ? '#60a5fa' : '#475569',
              boxShadow: isFocused ? '0 0 20px rgba(96, 165, 250, 0.3)' : '0 0 0px rgba(96, 165, 250, 0)'
            }}
          >
            <textarea
              ref={textareaRef}
              id="pitchText"
              value={pitchText}
              onChange={handleTextChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={12}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg 
                         text-white placeholder-slate-400 resize-none focus:outline-none
                         transition-all duration-300"
              placeholder="Enter your startup pitch here...

Include:
• Problem statement and market opportunity
• Your unique solution and value proposition  
• Business model and revenue strategy
• Team background and expertise
• Funding requirements and use of funds"
              disabled={isLoading}
            />
            
            {/* Character count overlay */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <motion.div
                animate={{ 
                  color: isOptimal ? '#10b981' : isValid ? '#f59e0b' : '#ef4444',
                  scale: charCount > 0 ? 1 : 0
                }}
                className="text-xs font-medium"
              >
                {charCount}
              </motion.div>
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isOptimal ? 'bg-green-400' : isValid ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
            </div>
          </motion.div>

          {/* Progress indicator */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Minimum: 50 characters</span>
              <span>Optimal: 200+ characters</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1">
              <motion.div
                className={`h-1 rounded-full transition-colors duration-300 ${
                  isOptimal ? 'bg-green-400' : isValid ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((charCount / 200) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Validation message */}
          <AnimatePresence>
            {charCount > 0 && charCount < 50 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center mt-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                Pitch too short. Add more details for accurate scoring.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-400">Error</h3>
                  <p className="text-sm text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={!isValid || isLoading}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300
                     flex items-center justify-center space-x-2 focus-ring
                     ${isValid && !isLoading
                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-blue'
                       : 'bg-slate-600 cursor-not-allowed'
                     }`}
          whileHover={isValid && !isLoading ? { scale: 1.02 } : {}}
          whileTap={isValid && !isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Pitch...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Analyze Pitch</span>
            </>
          )}
        </motion.button>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/30 rounded-lg p-4 border border-slate-700"
        >
          <h4 className="text-sm font-medium text-slate-300 mb-2">💡 Pro Tips</h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Be specific about your target market and customer pain points</li>
            <li>• Highlight your unique competitive advantages</li>
            <li>• Include concrete metrics and traction when possible</li>
            <li>• Mention your team's relevant experience and expertise</li>
          </ul>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default PitchForm