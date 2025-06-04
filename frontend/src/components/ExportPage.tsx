import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, Copy, FileText, Image, Mail, Link } from 'lucide-react'
import toast from 'react-hot-toast'
import { useExportShare } from '../hooks/useExportShare'
import ClickSpark from './ClickSpark'
import PixelCard from './PixelCard'

interface ExportPageProps {
  analysisData?: {
    scores: {
      clarity: number
      originality: number
      team_strength: number
      market_fit: number
    }
    receipt: string
  }
}

const ExportPage: React.FC<ExportPageProps> = ({ analysisData }) => {
  const { generatePDF, shareResults, exportAsImage, copyReceiptHash, isExporting } = useExportShare()
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'image' | 'text'>('pdf')

  if (!analysisData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center px-4 py-12"
      >
        <div className="max-w-2xl mx-auto glass-card p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            <span className="text-gradient">Export Results</span>
          </h1>
          <p className="text-white/70 mb-6">
            No analysis data available to export. Please complete a pitch analysis first.
          </p>
          <div className="text-6xl mb-4">📊</div>
          <button className="glass-button px-6 py-3 text-white font-medium">
            Start New Analysis
          </button>
        </div>
      </motion.div>
    )
  }

  const averageScore = Object.values(analysisData.scores).reduce((sum, score) => sum + score, 0) / 4

  const exportData = {
    scores: analysisData.scores,
    receipt: analysisData.receipt,
    timestamp: new Date().toLocaleString(),
    averageScore
  }

  const handleExportPDF = () => {
    generatePDF(exportData)
  }

  const handleExportImage = () => {
    exportAsImage('results-container')
  }

  const handleShare = () => {
    shareResults(exportData)
  }

  const handleCopyReceipt = () => {
    copyReceiptHash(analysisData.receipt)
  }

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}?receipt=${analysisData.receipt}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const formatOptions = [
    {
      id: 'pdf',
      label: 'PDF Report',
      icon: <FileText className="w-5 h-5" />,
      description: 'Professional report with detailed breakdown',
      action: handleExportPDF
    },
    {
      id: 'image',
      label: 'PNG Image',
      icon: <Image className="w-5 h-5" />,
      description: 'Visual summary for social sharing',
      action: handleExportImage
    },
    {
      id: 'text',
      label: 'Share Text',
      icon: <Share2 className="w-5 h-5" />,
      description: 'Formatted text for messaging',
      action: handleShare
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            <span className="text-gradient">Export & Share</span>
          </h1>

          {/* Results Preview */}
          <div id="results-container" className="glass-card p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Analysis Results
            </h2>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {averageScore.toFixed(1)}/10
              </div>
              <div className="text-white/70">Overall Score</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(analysisData.scores).map(([key, score]) => (
                <div key={key} className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {score.toFixed(1)}
                  </div>
                  <div className="text-sm text-white/70 capitalize">
                    {key.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-xs text-white/50 mb-2">Cryptographic Receipt</div>
              <div className="font-mono text-xs text-white/70 bg-black/20 p-2 rounded break-all">
                {analysisData.receipt.substring(0, 32)}...
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Choose Export Format</h3>
            
            <div className="grid gap-4">
              {formatOptions.map((option, index) => (
                <ClickSpark
                  key={option.id}
                  sparkColor={index === 0 ? "#ef4444" : index === 1 ? "#10b981" : "#3b82f6"}
                  sparkCount={6}
                  sparkRadius={20}
                >
                  <PixelCard variant={index === 0 ? "pink" : index === 1 ? "yellow" : "blue"}>
                    <motion.button
                      onClick={option.action}
                      disabled={isExporting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full glass-card p-4 text-left hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-blue-400">
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-white/60 text-sm">{option.description}</div>
                        </div>
                        <Download className="w-5 h-5 text-white/40" />
                      </div>
                    </motion.button>
                  </PixelCard>
                </ClickSpark>
              ))}
            </div>
          </div>

          {/* Additional Actions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Additional Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleCopyReceipt}
                className="glass-button p-4 text-left hover:bg-white/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Copy className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Copy Receipt</div>
                    <div className="text-white/60 text-sm">Cryptographic proof</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleCopyLink}
                className="glass-button p-4 text-left hover:bg-white/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Link className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Copy Share Link</div>
                    <div className="text-white/60 text-sm">Direct link to results</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 glass-card p-4 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 mt-1">🔒</div>
              <div>
                <div className="text-white font-medium mb-1">Privacy Notice</div>
                <div className="text-white/70 text-sm">
                  Your pitch content was encrypted and has been permanently deleted from our servers. 
                  Only the analysis scores and cryptographic receipt are included in exports.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ExportPage
