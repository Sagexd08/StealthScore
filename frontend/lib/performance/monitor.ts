import { AnalyticsService } from '../services/analytics'

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  
  // Custom metrics
  pageLoadTime?: number
  apiResponseTime?: number
  renderTime?: number
  memoryUsage?: number
  
  // User experience
  interactionDelay?: number
  scrollPerformance?: number
  animationFrameRate?: number
}

export interface PerformanceBudget {
  fcp: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
  pageLoadTime: number
  apiResponseTime: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics = {}
  private budget: PerformanceBudget = {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    ttfb: 600, // 600ms
    pageLoadTime: 3000, // 3s
    apiResponseTime: 1000 // 1s
  }
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  initialize(): void {
    if (typeof window === 'undefined') return

    this.setupCoreWebVitalsMonitoring()
    this.setupCustomMetricsMonitoring()
    this.setupMemoryMonitoring()
    this.setupNetworkMonitoring()
    this.setupUserInteractionMonitoring()
  }

  private setupCoreWebVitalsMonitoring(): void {
    // First Contentful Paint
    this.observePerformanceEntries('paint', (entries) => {
      for (const entry of entries) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime
          this.checkBudget('fcp', entry.startTime)
        }
      }
    })

    // Largest Contentful Paint
    this.observePerformanceEntries('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        this.metrics.lcp = lastEntry.startTime
        this.checkBudget('lcp', lastEntry.startTime)
      }
    })

    // First Input Delay
    this.observePerformanceEntries('first-input', (entries) => {
      for (const entry of entries) {
        this.metrics.fid = entry.processingStart - entry.startTime
        this.checkBudget('fid', this.metrics.fid)
      }
    })

    // Cumulative Layout Shift
    this.observePerformanceEntries('layout-shift', (entries) => {
      let clsValue = 0
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      this.metrics.cls = clsValue
      this.checkBudget('cls', clsValue)
    })

    // Time to First Byte
    this.observePerformanceEntries('navigation', (entries) => {
      for (const entry of entries) {
        const navEntry = entry as PerformanceNavigationTiming
        this.metrics.ttfb = navEntry.responseStart - navEntry.fetchStart
        this.checkBudget('ttfb', this.metrics.ttfb)
      }
    })
  }

  private setupCustomMetricsMonitoring(): void {
    // Page Load Time
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      this.metrics.pageLoadTime = loadTime
      this.checkBudget('pageLoadTime', loadTime)
      
      this.reportMetrics('page_load', { loadTime })
    })

    // Render Time Monitoring
    this.measureRenderTime()
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = memory.usedJSHeapSize
        
        // Alert if memory usage is high
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          this.reportAlert('high_memory_usage', {
            used: memory.usedJSHeapSize,
            limit: memory.jsHeapSizeLimit
          })
        }
      }, 30000) // Check every 30 seconds
    }
  }

  private setupNetworkMonitoring(): void {
    // Monitor API response times
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const responseTime = endTime - startTime
        
        this.metrics.apiResponseTime = responseTime
        this.checkBudget('apiResponseTime', responseTime)
        
        this.reportMetrics('api_response', {
          url: args[0],
          responseTime,
          status: response.status
        })
        
        return response
      } catch (error) {
        const endTime = performance.now()
        const responseTime = endTime - startTime
        
        this.reportMetrics('api_error', {
          url: args[0],
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        
        throw error
      }
    }
  }

  private setupUserInteractionMonitoring(): void {
    // Monitor interaction delays
    let interactionStart = 0
    
    document.addEventListener('click', () => {
      interactionStart = performance.now()
    })
    
    document.addEventListener('input', () => {
      if (interactionStart > 0) {
        const delay = performance.now() - interactionStart
        this.metrics.interactionDelay = delay
        
        if (delay > 100) { // Alert if delay > 100ms
          this.reportAlert('slow_interaction', { delay })
        }
        
        interactionStart = 0
      }
    })

    // Monitor scroll performance
    let scrollStart = 0
    let scrollFrames = 0
    
    document.addEventListener('scroll', () => {
      if (scrollStart === 0) {
        scrollStart = performance.now()
        scrollFrames = 0
      }
      
      requestAnimationFrame(() => {
        scrollFrames++
        const scrollTime = performance.now() - scrollStart
        
        if (scrollTime > 100) { // Measure over 100ms windows
          const fps = (scrollFrames / scrollTime) * 1000
          this.metrics.scrollPerformance = fps
          
          if (fps < 30) { // Alert if FPS < 30
            this.reportAlert('poor_scroll_performance', { fps })
          }
          
          scrollStart = 0
        }
      })
    })
  }

  private observePerformanceEntries(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ entryTypes: [entryType] })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error)
    }
  }

  private measureRenderTime(): void {
    const startTime = performance.now()
    
    requestAnimationFrame(() => {
      const renderTime = performance.now() - startTime
      this.metrics.renderTime = renderTime
      
      this.reportMetrics('render_time', { renderTime })
    })
  }

  private checkBudget(metric: keyof PerformanceBudget, value: number): void {
    const budget = this.budget[metric]
    if (value > budget) {
      this.reportAlert('budget_exceeded', {
        metric,
        value,
        budget,
        overage: value - budget
      })
    }
  }

  private async reportMetrics(event: string, data: any): Promise<void> {
    try {
      await AnalyticsService.trackPerformance({
        metric: event,
        value: data.value || 0,
        unit: 'ms',
        context: data
      })
    } catch (error) {
      console.error('Failed to report performance metrics:', error)
    }
  }

  private async reportAlert(type: string, data: any): Promise<void> {
    try {
      await AnalyticsService.trackError({
        message: `Performance alert: ${type}`,
        component: 'PerformanceMonitor',
        action: type,
        severity: 'medium'
      })
    } catch (error) {
      console.error('Failed to report performance alert:', error)
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Update performance budget
  setBudget(budget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...budget }
  }

  // Get performance score (0-100)
  getPerformanceScore(): number {
    const scores: number[] = []
    
    // Core Web Vitals scoring
    if (this.metrics.fcp) {
      scores.push(this.scoreMetric(this.metrics.fcp, 1800, 3000))
    }
    
    if (this.metrics.lcp) {
      scores.push(this.scoreMetric(this.metrics.lcp, 2500, 4000))
    }
    
    if (this.metrics.fid) {
      scores.push(this.scoreMetric(this.metrics.fid, 100, 300))
    }
    
    if (this.metrics.cls) {
      scores.push(this.scoreMetric(this.metrics.cls, 0.1, 0.25))
    }
    
    if (this.metrics.ttfb) {
      scores.push(this.scoreMetric(this.metrics.ttfb, 600, 1500))
    }
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  }

  private scoreMetric(value: number, good: number, poor: number): number {
    if (value <= good) return 100
    if (value >= poor) return 0
    return Math.round(100 - ((value - good) / (poor - good)) * 100)
  }

  // Generate performance report
  generateReport(): string {
    const metrics = this.getMetrics()
    const score = this.getPerformanceScore()
    
    let report = `# Performance Report\n\n`
    report += `**Overall Score: ${score.toFixed(1)}/100**\n\n`
    
    if (score >= 90) {
      report += `🟢 **Excellent** - Your app performs very well\n\n`
    } else if (score >= 75) {
      report += `🟡 **Good** - Minor performance improvements possible\n\n`
    } else if (score >= 50) {
      report += `🟠 **Needs Improvement** - Several performance issues detected\n\n`
    } else {
      report += `🔴 **Poor** - Significant performance improvements needed\n\n`
    }
    
    report += `## Core Web Vitals\n\n`
    
    if (metrics.fcp) {
      report += `- **First Contentful Paint**: ${metrics.fcp.toFixed(0)}ms ${this.getScoreEmoji(this.scoreMetric(metrics.fcp, 1800, 3000))}\n`
    }
    
    if (metrics.lcp) {
      report += `- **Largest Contentful Paint**: ${metrics.lcp.toFixed(0)}ms ${this.getScoreEmoji(this.scoreMetric(metrics.lcp, 2500, 4000))}\n`
    }
    
    if (metrics.fid) {
      report += `- **First Input Delay**: ${metrics.fid.toFixed(0)}ms ${this.getScoreEmoji(this.scoreMetric(metrics.fid, 100, 300))}\n`
    }
    
    if (metrics.cls) {
      report += `- **Cumulative Layout Shift**: ${metrics.cls.toFixed(3)} ${this.getScoreEmoji(this.scoreMetric(metrics.cls, 0.1, 0.25))}\n`
    }
    
    if (metrics.ttfb) {
      report += `- **Time to First Byte**: ${metrics.ttfb.toFixed(0)}ms ${this.getScoreEmoji(this.scoreMetric(metrics.ttfb, 600, 1500))}\n`
    }
    
    report += `\n## Additional Metrics\n\n`
    
    if (metrics.pageLoadTime) {
      report += `- **Page Load Time**: ${metrics.pageLoadTime.toFixed(0)}ms\n`
    }
    
    if (metrics.apiResponseTime) {
      report += `- **API Response Time**: ${metrics.apiResponseTime.toFixed(0)}ms\n`
    }
    
    if (metrics.memoryUsage) {
      report += `- **Memory Usage**: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB\n`
    }
    
    report += `\n---\n*Report generated on ${new Date().toLocaleString()}*`
    
    return report
  }

  private getScoreEmoji(score: number): string {
    if (score >= 90) return '🟢'
    if (score >= 75) return '🟡'
    return '🔴'
  }

  // Cleanup observers
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance()

// React hook for performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({})
  const [score, setScore] = React.useState(0)

  React.useEffect(() => {
    performanceMonitor.initialize()
    
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics())
      setScore(performanceMonitor.getPerformanceScore())
    }, 5000)

    return () => {
      clearInterval(interval)
      performanceMonitor.destroy()
    }
  }, [])

  return { metrics, score }
}

// React import for hooks
import React from 'react'
