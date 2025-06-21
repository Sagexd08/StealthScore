import { NextRequest, NextResponse } from 'next/server'
import { RateLimiter, CSPUtils, AdvancedEncryption } from './encryption'
import { AnalyticsService } from '../services/analytics'

export interface SecurityConfig {
  rateLimiting: {
    enabled: boolean
    maxRequests: number
    windowMs: number
  }
  csrf: {
    enabled: boolean
    tokenName: string
  }
  headers: {
    csp: boolean
    hsts: boolean
    noSniff: boolean
    frameOptions: boolean
  }
  logging: {
    enabled: boolean
    logLevel: 'info' | 'warn' | 'error'
  }
}

const defaultConfig: SecurityConfig = {
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  csrf: {
    enabled: true,
    tokenName: 'csrf-token'
  },
  headers: {
    csp: true,
    hsts: true,
    noSniff: true,
    frameOptions: true
  },
  logging: {
    enabled: true,
    logLevel: 'warn'
  }
}

export class SecurityMiddleware {
  private config: SecurityConfig

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  async handle(request: NextRequest): Promise<NextResponse> {
    const response = NextResponse.next()
    const clientIP = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    try {
      // Rate limiting
      if (this.config.rateLimiting.enabled) {
        const rateLimitResult = this.checkRateLimit(clientIP, request.url)
        if (!rateLimitResult.allowed) {
          await this.logSecurityEvent('rate_limit_exceeded', {
            ip: clientIP,
            url: request.url,
            userAgent
          })
          
          return new NextResponse('Rate limit exceeded', {
            status: 429,
            headers: {
              'Retry-After': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
              'X-RateLimit-Limit': this.config.rateLimiting.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
            }
          })
        }

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', this.config.rateLimiting.maxRequests.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
        response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
      }

      // CSRF protection
      if (this.config.csrf.enabled && this.isStateChangingRequest(request)) {
        const csrfResult = await this.validateCSRF(request)
        if (!csrfResult.valid) {
          await this.logSecurityEvent('csrf_validation_failed', {
            ip: clientIP,
            url: request.url,
            userAgent,
            reason: csrfResult.reason
          })
          
          return new NextResponse('CSRF validation failed', { status: 403 })
        }
      }

      // Input validation and sanitization
      const validationResult = await this.validateInput(request)
      if (!validationResult.valid) {
        await this.logSecurityEvent('input_validation_failed', {
          ip: clientIP,
          url: request.url,
          userAgent,
          violations: validationResult.violations
        })
        
        return new NextResponse('Invalid input detected', { status: 400 })
      }

      // Security headers
      this.addSecurityHeaders(response, request)

      // Log successful request
      if (this.config.logging.enabled) {
        await this.logSecurityEvent('request_processed', {
          ip: clientIP,
          url: request.url,
          method: request.method,
          userAgent
        })
      }

      return response

    } catch (error) {
      await this.logSecurityEvent('middleware_error', {
        ip: clientIP,
        url: request.url,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      return new NextResponse('Internal security error', { status: 500 })
    }
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip')
    
    return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown'
  }

  private checkRateLimit(identifier: string, url: string): {
    allowed: boolean
    remaining: number
    resetTime: number
  } {
    const { maxRequests, windowMs } = this.config.rateLimiting
    const allowed = RateLimiter.isAllowed(identifier, maxRequests, windowMs)
    const remaining = RateLimiter.getRemainingRequests(identifier, maxRequests, windowMs)
    const resetTime = RateLimiter.getResetTime(identifier, windowMs)

    return { allowed, remaining, resetTime }
  }

  private isStateChangingRequest(request: NextRequest): boolean {
    const method = request.method.toUpperCase()
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
  }

  private async validateCSRF(request: NextRequest): Promise<{
    valid: boolean
    reason?: string
  }> {
    const token = request.headers.get(this.config.csrf.tokenName) || 
                  request.headers.get('x-csrf-token')
    
    if (!token) {
      return { valid: false, reason: 'Missing CSRF token' }
    }

    // Validate token format and expiry
    try {
      const [tokenData, signature] = token.split('.')
      if (!tokenData || !signature) {
        return { valid: false, reason: 'Invalid token format' }
      }

      const decoded = JSON.parse(atob(tokenData))
      const now = Date.now()
      
      if (decoded.exp < now) {
        return { valid: false, reason: 'Token expired' }
      }

      // Verify signature (simplified - in production use proper JWT verification)
      const expectedSignature = AdvancedEncryption.hashData(tokenData + process.env.CSRF_SECRET)
      if (!AdvancedEncryption.constantTimeCompare(signature, expectedSignature)) {
        return { valid: false, reason: 'Invalid signature' }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, reason: 'Token parsing error' }
    }
  }

  private async validateInput(request: NextRequest): Promise<{
    valid: boolean
    violations: string[]
  }> {
    const violations: string[] = []
    const url = request.url
    const method = request.method

    // Check for common attack patterns
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /\.\.\//g,
      /union\s+select/gi,
      /drop\s+table/gi,
      /exec\s*\(/gi
    ]

    // Validate URL
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        violations.push(`Suspicious pattern in URL: ${pattern.source}`)
      }
    }

    // Validate headers
    const userAgent = request.headers.get('user-agent') || ''
    if (userAgent.length > 1000) {
      violations.push('User-Agent header too long')
    }

    // Validate request body for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const contentType = request.headers.get('content-type') || ''
        
        if (contentType.includes('application/json')) {
          const body = await request.clone().text()
          
          // Check body size
          if (body.length > 1024 * 1024) { // 1MB limit
            violations.push('Request body too large')
          }

          // Check for suspicious patterns in JSON
          for (const pattern of suspiciousPatterns) {
            if (pattern.test(body)) {
              violations.push(`Suspicious pattern in body: ${pattern.source}`)
            }
          }
        }
      } catch (error) {
        violations.push('Error parsing request body')
      }
    }

    return {
      valid: violations.length === 0,
      violations
    }
  }

  private addSecurityHeaders(response: NextResponse, request: NextRequest): void {
    const { headers } = this.config

    if (headers.csp) {
      const nonce = CSPUtils.generateNonce()
      response.headers.set('Content-Security-Policy', CSPUtils.buildCSPHeader(nonce))
      response.headers.set('X-Content-Security-Policy', CSPUtils.buildCSPHeader(nonce))
      response.headers.set('X-WebKit-CSP', CSPUtils.buildCSPHeader(nonce))
    }

    if (headers.hsts) {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      )
    }

    if (headers.noSniff) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
    }

    if (headers.frameOptions) {
      response.headers.set('X-Frame-Options', 'DENY')
    }

    // Additional security headers
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
    
    // Remove server information
    response.headers.delete('Server')
    response.headers.delete('X-Powered-By')
    
    // Add custom security headers
    response.headers.set('X-Security-Version', '2.0')
    response.headers.set('X-Request-ID', AdvancedEncryption.generateSecureToken(16))
  }

  private async logSecurityEvent(event: string, data: any): Promise<void> {
    if (!this.config.logging.enabled) return

    try {
      // Log to analytics service
      await AnalyticsService.trackEvent({
        eventType: 'security',
        eventName: event,
        properties: {
          ...data,
          timestamp: new Date().toISOString(),
          severity: this.getEventSeverity(event)
        }
      })

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Security] ${event}:`, data)
      }
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  private getEventSeverity(event: string): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'rate_limit_exceeded': 'medium',
      'csrf_validation_failed': 'high',
      'input_validation_failed': 'high',
      'middleware_error': 'critical',
      'request_processed': 'low'
    }

    return severityMap[event] || 'medium'
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    const payload = {
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      nonce: AdvancedEncryption.generateSecureToken(16)
    }

    const tokenData = btoa(JSON.stringify(payload))
    const signature = AdvancedEncryption.hashData(tokenData + process.env.CSRF_SECRET)
    
    return `${tokenData}.${signature}`
  }

  // Validate API key
  static async validateAPIKey(apiKey: string): Promise<{
    valid: boolean
    userId?: string
    rateLimit?: number
  }> {
    try {
      // Hash the API key for lookup
      const hashedKey = AdvancedEncryption.hashData(apiKey)
      
      // In a real implementation, this would query the database
      // For now, return a mock validation
      return {
        valid: true,
        userId: 'user-123',
        rateLimit: 1000
      }
    } catch (error) {
      return { valid: false }
    }
  }
}

// Export middleware function for Next.js
export function createSecurityMiddleware(config?: Partial<SecurityConfig>) {
  const middleware = new SecurityMiddleware(config)
  
  return async (request: NextRequest) => {
    return middleware.handle(request)
  }
}
