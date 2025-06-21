import { AnalyticsService } from '../services/analytics'

export interface CacheConfig {
  maxSize: number
  ttl: number // Time to live in milliseconds
  enableCompression: boolean
  enableMetrics: boolean
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  size: number
  compressed: boolean
}

export interface CacheMetrics {
  totalEntries: number
  totalSize: number
  hitRate: number
  missRate: number
  evictions: number
  compressionRatio: number
}

export class AdvancedCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>()
  private config: CacheConfig
  private metrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0
  }

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100 * 1024 * 1024, // 100MB default
      ttl: 5 * 60 * 1000, // 5 minutes default
      enableCompression: true,
      enableMetrics: true,
      ...config
    }

    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60000) // Every minute
  }

  async set(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const entryTTL = ttl || this.config.ttl
      const timestamp = Date.now()
      
      let processedData = data
      let compressed = false
      let size = this.estimateSize(data)

      // Compress large data if enabled
      if (this.config.enableCompression && size > 1024) {
        try {
          processedData = await this.compress(data)
          compressed = true
          size = this.estimateSize(processedData)
        } catch (error) {
          console.warn('Compression failed, storing uncompressed:', error)
        }
      }

      // Check if we need to evict entries
      await this.ensureSpace(size)

      const entry: CacheEntry<T> = {
        data: processedData,
        timestamp,
        ttl: entryTTL,
        hits: 0,
        size,
        compressed
      }

      this.cache.set(key, entry)
      this.metrics.totalSize += size

      if (this.config.enableMetrics) {
        await AnalyticsService.trackPerformance({
          metric: 'cache_set',
          value: size,
          unit: 'bytes',
          context: {
            key: this.hashKey(key),
            compressed,
            ttl: entryTTL
          }
        })
      }
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async get(key: string): Promise<T | null> {
    try {
      const entry = this.cache.get(key)
      
      if (!entry) {
        this.metrics.misses++
        return null
      }

      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        this.metrics.totalSize -= entry.size
        this.metrics.misses++
        return null
      }

      // Update hit count
      entry.hits++
      this.metrics.hits++

      // Decompress if needed
      let data = entry.data
      if (entry.compressed) {
        try {
          data = await this.decompress(entry.data)
        } catch (error) {
          console.error('Decompression failed:', error)
          this.cache.delete(key)
          return null
        }
      }

      if (this.config.enableMetrics) {
        await AnalyticsService.trackPerformance({
          metric: 'cache_hit',
          value: entry.hits,
          unit: 'count',
          context: {
            key: this.hashKey(key)
          }
        })
      }

      return data
    } catch (error) {
      console.error('Cache get error:', error)
      this.metrics.misses++
      return null
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.metrics.totalSize -= entry.size
      return false
    }
    
    return true
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.metrics.totalSize -= entry.size
      return this.cache.delete(key)
    }
    return false
  }

  clear(): void {
    this.cache.clear()
    this.metrics.totalSize = 0
    this.metrics.hits = 0
    this.metrics.misses = 0
    this.metrics.evictions = 0
  }

  // Get cache statistics
  getMetrics(): CacheMetrics {
    const totalRequests = this.metrics.hits + this.metrics.misses
    const hitRate = totalRequests > 0 ? this.metrics.hits / totalRequests : 0
    const missRate = totalRequests > 0 ? this.metrics.misses / totalRequests : 0

    let compressionRatio = 0
    let compressedEntries = 0
    let uncompressedSize = 0
    let compressedSize = 0

    Array.from(this.cache.values()).forEach(entry => {
      if (entry.compressed) {
        compressedEntries++
        compressedSize += entry.size
        // Estimate original size (this is approximate)
        uncompressedSize += entry.size * 2
      }
    })

    if (compressedEntries > 0) {
      compressionRatio = 1 - (compressedSize / uncompressedSize)
    }

    return {
      totalEntries: this.cache.size,
      totalSize: this.metrics.totalSize,
      hitRate,
      missRate,
      evictions: this.metrics.evictions,
      compressionRatio
    }
  }

  // Cleanup expired entries
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
        this.metrics.totalSize -= entry.size
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  // Ensure we have space for new entry
  private async ensureSpace(newEntrySize: number): Promise<void> {
    if (this.metrics.totalSize + newEntrySize <= this.config.maxSize) {
      return
    }

    // Evict entries using LRU strategy
    const entries = Array.from(this.cache.entries())
    entries.sort((a, b) => {
      // Sort by last access time (timestamp + hits as a proxy)
      const aScore = a[1].timestamp + (a[1].hits * 1000)
      const bScore = b[1].timestamp + (b[1].hits * 1000)
      return aScore - bScore
    })

    let freedSpace = 0
    entries.forEach(([key, entry]) => {
      if (this.metrics.totalSize - freedSpace + newEntrySize <= this.config.maxSize) {
        return
      }

      this.cache.delete(key)
      freedSpace += entry.size
      this.metrics.evictions++
    })

    this.metrics.totalSize -= freedSpace
  }

  // Estimate memory size of data
  private estimateSize(data: any): number {
    if (typeof data === 'string') {
      return data.length * 2 // UTF-16 encoding
    }
    
    if (data instanceof ArrayBuffer) {
      return data.byteLength
    }
    
    if (data instanceof Uint8Array) {
      return data.byteLength
    }
    
    // For objects, estimate based on JSON size
    try {
      return JSON.stringify(data).length * 2
    } catch {
      return 1024 // Default estimate
    }
  }

  // Simple compression using built-in compression
  private async compress(data: T): Promise<T> {
    if (typeof data === 'string') {
      // Use TextEncoder/TextDecoder for string compression simulation
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()
      const encoded = encoder.encode(data)
      
      // Simple run-length encoding for demonstration
      const compressed = this.runLengthEncode(encoded)
      return decoder.decode(compressed) as T
    }
    
    return data // Return as-is if compression not supported
  }

  private async decompress(data: T): Promise<T> {
    if (typeof data === 'string') {
      const encoder = new TextEncoder()
      const decoder = new TextDecoder()
      const encoded = encoder.encode(data)
      
      // Decompress using run-length decoding
      const decompressed = this.runLengthDecode(encoded)
      return decoder.decode(decompressed) as T
    }
    
    return data
  }

  // Simple run-length encoding
  private runLengthEncode(data: Uint8Array): Uint8Array {
    const result: number[] = []
    let i = 0
    
    while (i < data.length) {
      let count = 1
      const current = data[i]
      
      while (i + count < data.length && data[i + count] === current && count < 255) {
        count++
      }
      
      result.push(count, current)
      i += count
    }
    
    return new Uint8Array(result)
  }

  // Simple run-length decoding
  private runLengthDecode(data: Uint8Array): Uint8Array {
    const result: number[] = []
    
    for (let i = 0; i < data.length; i += 2) {
      const count = data[i]
      const value = data[i + 1]
      
      for (let j = 0; j < count; j++) {
        result.push(value)
      }
    }
    
    return new Uint8Array(result)
  }

  // Hash key for privacy in metrics
  private hashKey(key: string): string {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }
}

// Global cache instances
export const queryCache = new AdvancedCache({
  maxSize: 50 * 1024 * 1024, // 50MB for database queries
  ttl: 5 * 60 * 1000, // 5 minutes
  enableCompression: true,
  enableMetrics: true
})

export const apiCache = new AdvancedCache({
  maxSize: 25 * 1024 * 1024, // 25MB for API responses
  ttl: 2 * 60 * 1000, // 2 minutes
  enableCompression: true,
  enableMetrics: true
})

export const userCache = new AdvancedCache({
  maxSize: 10 * 1024 * 1024, // 10MB for user data
  ttl: 10 * 60 * 1000, // 10 minutes
  enableCompression: false, // User data is usually small
  enableMetrics: true
})

// Cache decorator for functions
export function cached(
  cache: AdvancedCache,
  keyGenerator?: (...args: any[]) => string,
  ttl?: number
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator ? keyGenerator(...args) : `${propertyName}_${JSON.stringify(args)}`
      
      // Try to get from cache first
      const cached = await cache.get(key)
      if (cached !== null) {
        return cached
      }

      // Execute original method
      const result = await method.apply(this, args)
      
      // Cache the result
      await cache.set(key, result, ttl)
      
      return result
    }

    return descriptor
  }
}

// React hook for cache metrics
export function useCacheMetrics() {
  const [metrics, setMetrics] = React.useState({
    query: queryCache.getMetrics(),
    api: apiCache.getMetrics(),
    user: userCache.getMetrics()
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        query: queryCache.getMetrics(),
        api: apiCache.getMetrics(),
        user: userCache.getMetrics()
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return metrics
}

// React import for hooks
import React from 'react'
