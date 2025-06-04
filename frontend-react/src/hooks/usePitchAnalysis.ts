import { useState } from 'react'
import toast from 'react-hot-toast'

interface Scores {
  clarity: number
  originality: number
  team_strength: number
  market_fit: number
}

interface AnalysisResult {
  scores: Scores
  receipt: string
}

export const usePitchAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [scores, setScores] = useState<Scores | null>(null)
  const [receipt, setReceipt] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  // Check if we're in a secure context
  const isSecureContext = (): boolean => {
    return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  }

  // Check if Web Crypto API is available
  const isCryptoAvailable = (): boolean => {
    return !!(window.crypto && window.crypto.subtle && window.crypto.getRandomValues)
  }

  // Fallback encryption using a simple XOR cipher (for development only)
  const fallbackEncrypt = (text: string): { ciphertext: string; iv: string; aes_key: string } => {
    console.warn('🚨 Using fallback encryption - NOT SECURE! Use HTTPS in production.')

    // Generate a simple "key" for demo purposes
    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const iv = Math.random().toString(36).substring(2, 15)

    // Simple XOR encryption (NOT SECURE - for demo only)
    let encrypted = ''
    for (let i = 0; i < text.length; i++) {
      const keyChar = key.charCodeAt(i % key.length)
      const textChar = text.charCodeAt(i)
      encrypted += String.fromCharCode(textChar ^ keyChar)
    }

    return {
      ciphertext: btoa(encrypted),
      iv: btoa(iv),
      aes_key: btoa(key)
    }
  }

  const generateAESKey = async (): Promise<CryptoKey> => {
    if (!isCryptoAvailable()) {
      throw new Error('Web Crypto API is not available. Please use HTTPS or a modern browser.');
    }

    try {
      return await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      )
    } catch (error) {
      throw new Error('Failed to generate encryption key. Please try again.');
    }
  }

  const generateIV = (): Uint8Array => {
    if (!isCryptoAvailable()) {
      throw new Error('Crypto API is not available for generating secure random values.');
    }
    return window.crypto.getRandomValues(new Uint8Array(12))
  }

  const encryptText = async (text: string, key: CryptoKey, iv: Uint8Array) => {
    if (!isCryptoAvailable()) {
      throw new Error('Web Crypto API is not available for encryption.');
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      )

      return {
        ciphertext: arrayBufferToBase64(encrypted),
        iv: arrayBufferToBase64(iv)
      }
    } catch (error) {
      throw new Error('Failed to encrypt data. Please try again.');
    }
  }

  const exportKeyToBase64 = async (key: CryptoKey): Promise<string> => {
    if (!isCryptoAvailable()) {
      throw new Error('Web Crypto API is not available for key export.');
    }

    try {
      const exported = await window.crypto.subtle.exportKey('raw', key)
      return arrayBufferToBase64(exported)
    } catch (error) {
      throw new Error('Failed to export encryption key.');
    }
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const sendToBackend = async (payload: {
    ciphertext: string
    iv: string
    aes_key: string
  }): Promise<AnalysisResult> => {
    const response = await fetch('http://localhost:8000/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  const analyzePitch = async (pitchText: string): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      let payload: { ciphertext: string; iv: string; aes_key: string }

      // Check if Web Crypto API is available
      if (!isCryptoAvailable() || !isSecureContext()) {
        // Use fallback encryption for development
        toast.loading('⚠️ Using fallback encryption (development mode)...', { id: 'encryption' })
        payload = fallbackEncrypt(pitchText)
      } else {
        // Use proper encryption
        toast.loading('🔐 Encrypting your pitch...', { id: 'encryption' })

        // Step 1: Generate encryption key and IV
        const key = await generateAESKey()
        const iv = generateIV()

        // Step 2: Encrypt the pitch
        const encryptedData = await encryptText(pitchText, key, iv)

        // Step 3: Export key to base64
        const keyBase64 = await exportKeyToBase64(key)

        // Step 4: Prepare payload
        payload = {
          ciphertext: encryptedData.ciphertext,
          iv: encryptedData.iv,
          aes_key: keyBase64
        }
      }

      toast.loading('🚀 Sending to AI analysis...', { id: 'encryption' })

      // Step 5: Send to backend
      const result = await sendToBackend(payload)

      toast.success('✅ Analysis complete!', { id: 'encryption' })

      // Step 6: Set results
      setScores(result.scores)
      setReceipt(result.receipt)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(`❌ Analysis failed: ${errorMessage}`, { id: 'encryption' })
      console.error('Analysis error:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setScores(null)
    setReceipt('')
    setError(null)
  }

  return {
    analyzePitch,
    isLoading,
    scores,
    receipt,
    error,
    reset
  }
}
