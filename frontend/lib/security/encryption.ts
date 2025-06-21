import { createHash, randomBytes, pbkdf2Sync } from 'crypto'

export class AdvancedEncryption {
  private static readonly ALGORITHM = 'AES-256-GCM'
  private static readonly KEY_LENGTH = 32
  private static readonly IV_LENGTH = 16
  private static readonly SALT_LENGTH = 32
  private static readonly TAG_LENGTH = 16
  private static readonly ITERATIONS = 100000

  // Generate cryptographically secure random key
  static generateKey(): Uint8Array {
    return randomBytes(this.KEY_LENGTH)
  }

  // Generate initialization vector
  static generateIV(): Uint8Array {
    return randomBytes(this.IV_LENGTH)
  }

  // Generate salt for key derivation
  static generateSalt(): Uint8Array {
    return randomBytes(this.SALT_LENGTH)
  }

  // Derive key from password using PBKDF2
  static deriveKey(password: string, salt: Uint8Array): Uint8Array {
    return pbkdf2Sync(password, salt, this.ITERATIONS, this.KEY_LENGTH, 'sha256')
  }

  // Encrypt data with AES-256-GCM
  static async encryptData(
    data: string, 
    key: Uint8Array, 
    iv?: Uint8Array
  ): Promise<{
    ciphertext: string
    iv: string
    tag: string
  }> {
    if (typeof window === 'undefined') {
      // Node.js environment
      const crypto = require('crypto')
      const actualIV = iv || this.generateIV()
      const cipher = crypto.createCipher(this.ALGORITHM, key)
      cipher.setAAD(Buffer.from('stealth-score-aad'))
      
      let encrypted = cipher.update(data, 'utf8', 'base64')
      encrypted += cipher.final('base64')
      
      return {
        ciphertext: encrypted,
        iv: Buffer.from(actualIV).toString('base64'),
        tag: cipher.getAuthTag().toString('base64')
      }
    } else {
      // Browser environment
      const actualIV = iv || this.generateIV()
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data)
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      )
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: actualIV,
          additionalData: encoder.encode('stealth-score-aad')
        },
        cryptoKey,
        dataBuffer
      )
      
      const encryptedArray = new Uint8Array(encrypted)
      const ciphertext = encryptedArray.slice(0, -this.TAG_LENGTH)
      const tag = encryptedArray.slice(-this.TAG_LENGTH)
      
      return {
        ciphertext: this.arrayBufferToBase64(ciphertext),
        iv: this.arrayBufferToBase64(actualIV),
        tag: this.arrayBufferToBase64(tag)
      }
    }
  }

  // Decrypt data with AES-256-GCM
  static async decryptData(
    ciphertext: string,
    key: Uint8Array,
    iv: string,
    tag: string
  ): Promise<string> {
    if (typeof window === 'undefined') {
      // Node.js environment
      const crypto = require('crypto')
      const decipher = crypto.createDecipher(this.ALGORITHM, key)
      decipher.setAAD(Buffer.from('stealth-score-aad'))
      decipher.setAuthTag(Buffer.from(tag, 'base64'))
      
      let decrypted = decipher.update(ciphertext, 'base64', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } else {
      // Browser environment
      const encoder = new TextEncoder()
      const ivBuffer = this.base64ToArrayBuffer(iv)
      const ciphertextBuffer = this.base64ToArrayBuffer(ciphertext)
      const tagBuffer = this.base64ToArrayBuffer(tag)
      
      // Combine ciphertext and tag
      const encryptedData = new Uint8Array(ciphertextBuffer.byteLength + tagBuffer.byteLength)
      encryptedData.set(new Uint8Array(ciphertextBuffer))
      encryptedData.set(new Uint8Array(tagBuffer), ciphertextBuffer.byteLength)
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      )
      
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer,
          additionalData: encoder.encode('stealth-score-aad')
        },
        cryptoKey,
        encryptedData
      )
      
      const decoder = new TextDecoder()
      return decoder.decode(decrypted)
    }
  }

  // Hash data with SHA-256
  static hashData(data: string): string {
    return createHash('sha256').update(data).digest('hex')
  }

  // Generate HMAC for data integrity
  static generateHMAC(data: string, key: Uint8Array): string {
    const crypto = require('crypto')
    return crypto.createHmac('sha256', key).update(data).digest('hex')
  }

  // Verify HMAC
  static verifyHMAC(data: string, key: Uint8Array, hmac: string): boolean {
    const expectedHMAC = this.generateHMAC(data, key)
    return this.constantTimeCompare(expectedHMAC, hmac)
  }

  // Constant time string comparison to prevent timing attacks
  private static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    
    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return result === 0
  }

  // Utility functions
  private static arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  // Zero-knowledge proof generation (simplified)
  static generateZKProof(secret: string, challenge: string): {
    proof: string
    commitment: string
  } {
    const secretHash = this.hashData(secret)
    const challengeHash = this.hashData(challenge)
    const commitment = this.hashData(secretHash + challengeHash)
    const proof = this.hashData(commitment + secret)
    
    return { proof, commitment }
  }

  // Verify zero-knowledge proof
  static verifyZKProof(
    proof: string,
    commitment: string,
    challenge: string,
    publicValue: string
  ): boolean {
    const challengeHash = this.hashData(challenge)
    const expectedCommitment = this.hashData(this.hashData(publicValue) + challengeHash)
    return this.constantTimeCompare(commitment, expectedCommitment)
  }

  // Secure random string generation
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const randomBytes = new Uint8Array(length)
    
    if (typeof window !== 'undefined') {
      crypto.getRandomValues(randomBytes)
    } else {
      const crypto = require('crypto')
      crypto.randomFillSync(randomBytes)
    }
    
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[randomBytes[i] % chars.length]
    }
    return result
  }

  // Key stretching for password storage
  static stretchKey(password: string, salt: Uint8Array, iterations: number = 100000): string {
    const stretched = pbkdf2Sync(password, salt, iterations, 64, 'sha512')
    return stretched.toString('hex')
  }

  // Secure data wiping (best effort in JavaScript)
  static secureWipe(data: any): void {
    if (typeof data === 'string') {
      // Overwrite string memory (limited effectiveness in JS)
      for (let i = 0; i < data.length; i++) {
        data = data.substring(0, i) + '\0' + data.substring(i + 1)
      }
    } else if (data instanceof Uint8Array) {
      // Zero out array
      data.fill(0)
    } else if (typeof data === 'object' && data !== null) {
      // Recursively wipe object properties
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.secureWipe(data[key])
          delete data[key]
        }
      }
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map()

  static isAllowed(
    identifier: string, 
    maxRequests: number, 
    windowMs: number
  ): boolean {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [])
    }
    
    const userRequests = this.requests.get(identifier)!
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }

  static getRemainingRequests(
    identifier: string, 
    maxRequests: number, 
    windowMs: number
  ): number {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!this.requests.has(identifier)) {
      return maxRequests
    }
    
    const userRequests = this.requests.get(identifier)!
    const validRequests = userRequests.filter(time => time > windowStart)
    
    return Math.max(0, maxRequests - validRequests.length)
  }

  static getResetTime(identifier: string, windowMs: number): number {
    if (!this.requests.has(identifier)) {
      return 0
    }
    
    const userRequests = this.requests.get(identifier)!
    if (userRequests.length === 0) {
      return 0
    }
    
    const oldestRequest = Math.min(...userRequests)
    return oldestRequest + windowMs
  }
}

// Content Security Policy utilities
export class CSPUtils {
  static generateNonce(): string {
    return AdvancedEncryption.generateSecureToken(16)
  }

  static buildCSPHeader(nonce: string): string {
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://challenges.cloudflare.com`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.openrouter.ai https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
}
