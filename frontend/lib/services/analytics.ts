import { DatabaseService } from './database'
import { v4 as uuidv4 } from 'uuid'

export interface PageViewEvent {
  page: string
  title: string
  referrer?: string
  loadTime?: number
}

export interface UserActionEvent {
  action: string
  category: string
  label?: string
  value?: number
  properties?: any
}

export interface PerformanceEvent {
  metric: string
  value: number
  unit: string
  context?: any
}

export class AnalyticsService {
  private static sessionId: string | null = null
  private static sessionStartTime: number = Date.now()
  private static pageViews: number = 0
  private static analysesPerformed: number = 0

  static initializeSession(): string {
    if (!this.sessionId) {
      this.sessionId = uuidv4()
      this.sessionStartTime = Date.now()
      this.createSession()
    }
    return this.sessionId
  }

  private static async createSession() {
    if (typeof window === 'undefined') return

    const sessionData = {
      sessionId: this.sessionId!,
      userAgent: navigator.userAgent,
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS()
    }

    await DatabaseService.createUserSession(sessionData)
  }

  static async trackPageView(event: PageViewEvent) {
    this.pageViews++
    
    await DatabaseService.trackEvent({
      eventType: 'page_view',
      eventName: 'page_viewed',
      properties: {
        page: event.page,
        title: event.title,
        referrer: event.referrer,
        load_time: event.loadTime,
        session_page_views: this.pageViews
      },
      sessionId: this.sessionId || undefined
    })

    // Update session with page view count
    if (this.sessionId) {
      await DatabaseService.updateUserSession(this.sessionId, {
        pagesVisited: this.pageViews
      })
    }
  }

  static async trackUserAction(event: UserActionEvent) {
    await DatabaseService.trackEvent({
      eventType: 'user_action',
      eventName: event.action,
      properties: {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.properties
      },
      sessionId: this.sessionId || undefined
    })
  }

  static async trackPitchAnalysis(analysisData: {
    analysisType: string
    duration: number
    scores: any
    success: boolean
    errorMessage?: string
  }) {
    this.analysesPerformed++

    await DatabaseService.trackEvent({
      eventType: 'pitch_analysis',
      eventName: 'analysis_completed',
      properties: {
        analysis_type: analysisData.analysisType,
        duration: analysisData.duration,
        success: analysisData.success,
        error_message: analysisData.errorMessage,
        clarity_score: analysisData.scores?.clarity,
        originality_score: analysisData.scores?.originality,
        team_strength_score: analysisData.scores?.team_strength,
        market_fit_score: analysisData.scores?.market_fit,
        session_analyses: this.analysesPerformed
      },
      sessionId: this.sessionId || undefined
    })

    // Update session with analysis count
    if (this.sessionId) {
      await DatabaseService.updateUserSession(this.sessionId, {
        analysesPerformed: this.analysesPerformed
      })
    }
  }

  static async trackPerformance(event: PerformanceEvent) {
    await DatabaseService.trackEvent({
      eventType: 'performance',
      eventName: event.metric,
      properties: {
        value: event.value,
        unit: event.unit,
        context: event.context
      },
      sessionId: this.sessionId || undefined
    })
  }

  static async trackError(error: {
    message: string
    stack?: string
    component?: string
    action?: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }) {
    await DatabaseService.trackEvent({
      eventType: 'error',
      eventName: 'error_occurred',
      properties: {
        message: error.message,
        stack: error.stack,
        component: error.component,
        action: error.action,
        severity: error.severity,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      },
      sessionId: this.sessionId || undefined
    })
  }

  static async trackFeatureUsage(feature: string, properties?: any) {
    await DatabaseService.trackEvent({
      eventType: 'feature_usage',
      eventName: 'feature_used',
      properties: {
        feature,
        ...properties
      },
      sessionId: this.sessionId || undefined
    })
  }

  static async trackConversion(event: {
    type: 'signup' | 'subscription' | 'payment' | 'referral'
    value?: number
    currency?: string
    properties?: any
  }) {
    await DatabaseService.trackEvent({
      eventType: 'conversion',
      eventName: event.type,
      properties: {
        value: event.value,
        currency: event.currency,
        ...event.properties
      },
      sessionId: this.sessionId || undefined
    })
  }

  static async endSession() {
    if (!this.sessionId) return

    const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000)

    await DatabaseService.updateUserSession(this.sessionId, {
      endedAt: new Date().toISOString(),
      duration: sessionDuration,
      pagesVisited: this.pageViews,
      analysesPerformed: this.analysesPerformed
    })

    await DatabaseService.trackEvent({
      eventType: 'session',
      eventName: 'session_ended',
      properties: {
        duration: sessionDuration,
        pages_visited: this.pageViews,
        analyses_performed: this.analysesPerformed
      },
      sessionId: this.sessionId
    })

    this.sessionId = null
    this.pageViews = 0
    this.analysesPerformed = 0
  }

  // Utility methods
  private static getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown'
    
    const userAgent = navigator.userAgent.toLowerCase()
    if (/tablet|ipad|playbook|silk/.test(userAgent)) return 'tablet'
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) return 'mobile'
    return 'desktop'
  }

  private static getBrowser(): string {
    if (typeof window === 'undefined') return 'unknown'
    
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'
    return 'Other'
  }

  private static getOS(): string {
    if (typeof window === 'undefined') return 'unknown'
    
    const userAgent = navigator.userAgent
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Other'
  }

  // Performance monitoring
  static measurePageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.trackPerformance({
        metric: 'page_load_time',
        value: navigation.loadEventEnd - navigation.fetchStart,
        unit: 'ms',
        context: {
          dns_time: navigation.domainLookupEnd - navigation.domainLookupStart,
          connect_time: navigation.connectEnd - navigation.connectStart,
          response_time: navigation.responseEnd - navigation.requestStart,
          dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
        }
      })
    })
  }

  // Real User Monitoring (RUM)
  static initializeRUM() {
    if (typeof window === 'undefined') return

    // Track Core Web Vitals
    this.trackCoreWebVitals()
    
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        component: 'global',
        action: 'javascript_error',
        severity: 'medium'
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        component: 'global',
        action: 'promise_rejection',
        severity: 'medium'
      })
    })
  }

  private static trackCoreWebVitals() {
    // This would typically use the web-vitals library
    // For now, we'll track basic performance metrics
    if (typeof window === 'undefined') return

    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.trackPerformance({
            metric: 'first_contentful_paint',
            value: entry.startTime,
            unit: 'ms'
          })
        }
      }
    })

    observer.observe({ entryTypes: ['paint'] })
  }
}
