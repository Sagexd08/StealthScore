import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Sparkles, FileText, Zap, AlertCircle, Upload, Mic, Play, Clock, Target, 
  BarChart3, Eye, TrendingUp, Square, Pause, ArrowLeft, CheckCircle, X, Volume2,
  FileCheck, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PitchInputProps {
  onSubmit: (pitchText: string) => void
  isLoading: boolean
  error: string | null
}

type AnalysisMethod = 'deck' | 'recording' | 'text' | null

interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioBlob: Blob | null
}

const PitchInput: React.FC<PitchInputProps> = ({ onSubmit, isLoading, error }) => {
  const [pitchText, setPitchText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState<AnalysisMethod>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null
  })
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setPitchText(text)
    setCharCount(text.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let analysisText = ''

    try {
      if (selectedMethod === 'text') {
        if (pitchText.trim().length < 50) {
          toast.error('Please provide a more detailed pitch (minimum 50 characters)')
          return
        }
        analysisText = pitchText.trim()
      } 
      else if (selectedMethod === 'deck') {
        if (!uploadedFile) {
          toast.error('Please upload a pitch deck file')
          return
        }
        analysisText = await extractTextFromFile(uploadedFile)
      } 
      else if (selectedMethod === 'recording') {
        if (!recordingState.audioBlob) {
          toast.error('Please record your pitch first')
          return
        }
        analysisText = await convertAudioToText(recordingState.audioBlob)
      }

      if (analysisText.length < 50) {
        toast.error('Extracted content is too short for analysis. Please provide more detailed content.')
        return
      }

      onSubmit(analysisText)
    } catch (error) {
      toast.error('Failed to process your input. Please try again.')
      console.error('Processing error:', error)
    }
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    setIsProcessingFile(true)
    try {
      if (file.type === 'application/pdf') {
        return await extractTextFromPDF(file)
      }
      else if (file.type.includes('presentation') || file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) {
        return await extractTextFromPowerPoint(file)
      }
      else {
        throw new Error('Unsupported file type')
      }
    } finally {
      setIsProcessingFile(false)
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Extracted text from PDF: ${file.name}. This is a simulated extraction of pitch deck content including problem statement, solution overview, market analysis, business model, team background, and financial projections. The deck demonstrates strong market opportunity with clear value proposition and experienced team.`)
      }, 2000)
    })
  }

  const extractTextFromPowerPoint = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Extracted text from PowerPoint: ${file.name}. This presentation covers the startup's vision, market opportunity, competitive landscape, product demonstration, go-to-market strategy, team credentials, financial model, and funding requirements. The slides show comprehensive business planning with clear execution roadmap.`)
      }, 2000)
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ]
      
      if (validTypes.includes(file.type) || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
        setUploadedFile(file)
        toast.success(`Uploaded: ${file.name}`)
      } else {
        toast.error('Please upload a PDF or PowerPoint file')
      }
    }
  }

  const convertAudioToText = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Transcribed pitch from audio recording (${recordingState.duration}s): Hello, I'm presenting our innovative startup that addresses a critical market need. Our solution leverages cutting-edge technology to solve real-world problems. We have a strong team with proven track record, clear business model, and significant market opportunity. We're seeking investment to scale our operations and capture market share. Our financial projections show strong growth potential with clear path to profitability.`)
      }, 3000)
    })
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      })
      
      streamRef.current = stream
      audioChunksRef.current = []
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setRecordingState(prev => ({ ...prev, audioBlob }))
      }
      
      setRecordingState(prev => ({ 
        ...prev, 
        isRecording: true, 
        isPaused: false, 
        duration: 0 
      }))
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
      
      mediaRecorder.start(1000)
      toast.success('Recording started!')
    } catch (error) {
      toast.error('Could not access microphone. Please check permissions.')
      console.error('Recording error:', error)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.pause()
      setRecordingState(prev => ({ ...prev, isPaused: true }))
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      
      toast.success('Recording paused')
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState.isPaused) {
      mediaRecorderRef.current.resume()
      setRecordingState(prev => ({ ...prev, isPaused: false }))
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
      
      toast.success('Recording resumed')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && (recordingState.isRecording || recordingState.isPaused)) {
      mediaRecorderRef.current.stop()
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      setRecordingState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isPaused: false 
      }))
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      
      toast.success(`Recording completed! Duration: ${formatTime(recordingState.duration)}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const resetToMethodSelection = () => {
    setSelectedMethod(null)
    setPitchText('')
    setCharCount(0)
    setUploadedFile(null)
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null
    })
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
  }

  const fillSamplePitch = () => {
    const samplePitch = `EcoTrack: Revolutionizing Carbon Footprint Management

Problem: 
Small and medium businesses struggle to accurately track and reduce their carbon footprint due to complex calculations and expensive consulting services.

Solution:
EcoTrack is an AI-powered SaaS platform that automatically calculates carbon emissions from business operations, provides actionable reduction strategies, and generates compliance reports.

Market Opportunity:
The carbon management software market is projected to reach $15.6B by 2027, with 40% of SMBs planning to invest in sustainability tools within the next 2 years.

Business Model:
Subscription-based pricing starting at $99/month for small businesses, with enterprise plans up to $999/month. Revenue projections show $2M ARR by year 2.

Team:
- Sarah Chen (CEO): Former sustainability consultant at McKinsey, 8 years experience
- Mike Rodriguez (CTO): Ex-Google engineer, built 3 successful B2B SaaS products
- Dr. Lisa Park (Chief Scientist): PhD in Environmental Science, published researcher

Traction:
- 50 pilot customers with 85% retention rate
- $150K in pre-orders
- Partnership with 3 major accounting firms
- Featured in TechCrunch and Forbes

Funding:
Seeking $1.5M Series A to scale sales team and expand product features.`
    
    setPitchText(samplePitch)
    setCharCount(samplePitch.length)
    toast.success('Sample pitch loaded!')
  }

  const getCharCountColor = () => {
    if (charCount < 50) return 'text-red-400'
    if (charCount < 100) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="glass-card p-6 md:p-8 max-w-4xl mx-auto relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Target className="w-8 h-8 text-blue-400" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white">Test Your Pitch</h2>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-white/70 text-lg">
            Choose your preferred method to analyze and improve your startup pitch with AI-powered insights
          </p>
        </motion.div>

        {!selectedMethod && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid md:grid-cols-2 gap-6 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod('deck')}
                className="glass-card p-6 cursor-pointer border-2 border-transparent hover:border-blue-400/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        Pitch Deck Analysis
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                          Easy
                        </span>
                        <span className="text-white/60 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          2-3 min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 mb-4">
                  Upload your pitch deck and get comprehensive AI-powered analysis on structure, content, and investor appeal.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span>Content Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Structure Review</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span>Visual Assessment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span>Investor Readiness Score</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Deck
                </motion.button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod('recording')}
                className="glass-card p-6 cursor-pointer border-2 border-transparent hover:border-purple-400/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        Pitch Practice Session
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                          Medium
                        </span>
                        <span className="text-white/60 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          5-10 min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 mb-4">
                  Record your pitch presentation and receive feedback on delivery, pacing, and persuasiveness.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Mic className="w-4 h-4 text-purple-400" />
                    <span>Speech Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Pacing Review</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Confidence Metrics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Improvement Tips</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Recording
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center mb-8"
            >
              <p className="text-white/60 mb-4">Or use the traditional method:</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMethod('text')}
                className="glass-button px-6 py-3 text-white/80 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
              >
                <FileText className="w-4 h-4" />
                Type Your Pitch
              </motion.button>
            </motion.div>
          </>
        )}

        {selectedMethod === 'deck' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetToMethodSelection}
                className="glass-button p-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h3 className="text-2xl font-bold text-white">Upload Your Pitch Deck</h3>
            </div>

            <div className="glass-card p-6 border-2 border-dashed border-blue-400/30 hover:border-blue-400/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
              />

              {!uploadedFile ? (
                <div className="text-center py-8">
                  <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Choose your pitch deck</h4>
                  <p className="text-white/60 mb-4">Upload PDF or PowerPoint files (max 10MB)</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Browse Files
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{uploadedFile.name}</p>
                      <p className="text-white/60 text-sm">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUploadedFile(null)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </div>

            {uploadedFile && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || isProcessingFile}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                {isProcessingFile ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing File...
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    Analyze Pitch Deck
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {selectedMethod === 'recording' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetToMethodSelection}
                className="glass-button p-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h3 className="text-2xl font-bold text-white">Record Your Pitch</h3>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="mb-6">
                <motion.div
                  animate={{
                    scale: recordingState.isRecording && !recordingState.isPaused ? [1, 1.1, 1] : 1,
                    boxShadow: recordingState.isRecording && !recordingState.isPaused
                      ? ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 20px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)']
                      : '0 0 0 0 rgba(239, 68, 68, 0)'
                  }}
                  transition={{ duration: 1, repeat: recordingState.isRecording && !recordingState.isPaused ? Infinity : 0 }}
                  className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    recordingState.isRecording && !recordingState.isPaused
                      ? 'bg-red-500'
                      : recordingState.isPaused
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'
                  }`}
                >
                  {recordingState.isRecording && !recordingState.isPaused ? (
                    <Volume2 className="w-10 h-10 text-white" />
                  ) : recordingState.isPaused ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </motion.div>

                <div className="text-3xl font-mono text-white mb-2">
                  {formatTime(recordingState.duration)}
                </div>

                <p className="text-white/60">
                  {recordingState.isRecording && !recordingState.isPaused
                    ? 'Recording in progress...'
                    : recordingState.isPaused
                    ? 'Recording paused'
                    : recordingState.audioBlob
                    ? 'Recording completed'
                    : 'Ready to record your pitch'}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                {!recordingState.isRecording && !recordingState.isPaused && !recordingState.audioBlob && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startRecording}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Recording
                  </motion.button>
                )}

                {recordingState.isRecording && !recordingState.isPaused && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={pauseRecording}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Pause className="w-5 h-5" />
                      Pause
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      Stop
                    </motion.button>
                  </>
                )}

                {recordingState.isPaused && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resumeRecording}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Resume
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      Stop
                    </motion.button>
                  </>
                )}

                {recordingState.audioBlob && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRecordingState({ isRecording: false, isPaused: false, duration: 0, audioBlob: null })}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Reset
                  </motion.button>
                )}
              </div>
            </div>

            {recordingState.audioBlob && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Speech...
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Analyze Recording
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {selectedMethod === 'text' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetToMethodSelection}
                className="glass-button p-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h3 className="text-2xl font-bold text-white">Type Your Pitch</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
              >
                <motion.textarea
                  ref={textareaRef}
                  value={pitchText}
                  onChange={handleTextChange}
                  placeholder="Enter your startup pitch here... Include your problem statement, solution, market opportunity, business model, and team background."
                  rows={16}
                  className="w-full p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.01 }}
                  disabled={isLoading}
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-4 right-4 flex items-center gap-2"
                >
                  <span className={`text-sm font-mono ${getCharCountColor()}`}>
                    {charCount}
                  </span>
                  <span className="text-white/50 text-sm">characters</span>
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-card p-4 border border-red-400/30 bg-red-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-4"
              >
                <motion.button
                  type="button"
                  onClick={fillSamplePitch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button px-6 py-3 text-white/80 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 min-h-[56px] w-full lg:w-auto lg:min-w-[200px]"
                  disabled={isLoading}
                >
                  <Sparkles className="w-4 h-4" />
                  Fill Sample Pitch
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: isLoading || pitchText.trim().length < 50 ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading || pitchText.trim().length < 50 ? 1 : 0.98 }}
                  disabled={isLoading || pitchText.trim().length < 50}
                  className="flex-1 lg:flex-[2] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 min-h-[56px] relative overflow-hidden"
                >
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3">
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Analyzing Pitch...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Analyze Pitch</span>
                        <Zap className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default PitchInput
