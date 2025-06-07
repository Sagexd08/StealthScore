import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { performanceMonitor } from '../utils/pwaUtils';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableOptimizations?: boolean;
  showMetrics?: boolean;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableOptimizations = true,
  showMetrics = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  // Device capability detection
  const detectDeviceCapabilities = useCallback(() => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 1;
    
    // Check memory (if available)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Check connection
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || 'unknown';
    
    // Determine if device is low-end
    const isLowEnd = cores <= 2 || memory <= 2;
    setIsLowEndDevice(isLowEnd);
    
    // Set connection speed
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      setConnectionSpeed('slow');
    } else if (effectiveType === '3g' || effectiveType === '4g') {
      setConnectionSpeed('fast');
    }
    
    return { cores, memory, effectiveType, isLowEnd };
  }, []);

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    // Get Core Web Vitals
    const currentMetrics = performanceMonitor.getMetrics();
    
    // Add memory usage if available
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      currentMetrics.memoryUsage = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;
    }
    
    // Add connection info
    const connection = (navigator as any).connection;
    if (connection) {
      currentMetrics.connectionType = connection.effectiveType;
    }
    
    setMetrics(currentMetrics);
  }, []);

  // Apply performance optimizations
  const applyOptimizations = useCallback(() => {
    if (!enableOptimizations) return;

    const deviceInfo = detectDeviceCapabilities();
    
    // Reduce animations for low-end devices
    if (deviceInfo.isLowEnd) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
    
    // Optimize images based on connection
    if (connectionSpeed === 'slow') {
      // Lazy load images more aggressively
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }
    
    // Preload critical resources for fast connections
    if (connectionSpeed === 'fast') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/api/health';
      document.head.appendChild(link);
    }
    
    // Memory management
    if (deviceInfo.memory <= 2) {
      // Reduce cache sizes
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('images') || name.includes('dynamic')) {
              caches.open(name).then(cache => {
                cache.keys().then(keys => {
                  // Keep only recent entries
                  const recentKeys = keys.slice(-10);
                  keys.forEach(key => {
                    if (!recentKeys.includes(key)) {
                      cache.delete(key);
                    }
                  });
                });
              });
            }
          });
        });
      }
    }
  }, [enableOptimizations, connectionSpeed, detectDeviceCapabilities]);

  // Resource hints for better performance
  const addResourceHints = useCallback(() => {
    // DNS prefetch for external domains
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'openrouter.ai',
      'api.stripe.com'
    ];
    
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
    
    // Preconnect to critical domains
    const criticalDomains = ['openrouter.ai'];
    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      document.head.appendChild(link);
    });
  }, []);

  // Initialize optimizations
  useEffect(() => {
    detectDeviceCapabilities();
    addResourceHints();
    
    // Monitor performance periodically
    const interval = setInterval(monitorPerformance, 5000);
    
    // Apply optimizations after initial render
    setTimeout(applyOptimizations, 1000);
    
    return () => clearInterval(interval);
  }, [detectDeviceCapabilities, addResourceHints, monitorPerformance, applyOptimizations]);

  // Performance metrics display component
  const MetricsDisplay = () => {
    if (!showMetrics) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg text-xs font-mono z-50"
      >
        <div className="space-y-1">
          <div className="font-bold text-green-400">Performance Metrics</div>
          {metrics.lcp && (
            <div className={`${metrics.lcp > 2500 ? 'text-red-400' : metrics.lcp > 1200 ? 'text-yellow-400' : 'text-green-400'}`}>
              LCP: {Math.round(metrics.lcp)}ms
            </div>
          )}
          {metrics.fid && (
            <div className={`${metrics.fid > 100 ? 'text-red-400' : metrics.fid > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
              FID: {Math.round(metrics.fid)}ms
            </div>
          )}
          {metrics.cls && (
            <div className={`${metrics.cls > 0.25 ? 'text-red-400' : metrics.cls > 0.1 ? 'text-yellow-400' : 'text-green-400'}`}>
              CLS: {metrics.cls.toFixed(3)}
            </div>
          )}
          {metrics.memoryUsage && (
            <div className={`${metrics.memoryUsage > 0.8 ? 'text-red-400' : metrics.memoryUsage > 0.6 ? 'text-yellow-400' : 'text-green-400'}`}>
              Memory: {Math.round(metrics.memoryUsage * 100)}%
            </div>
          )}
          {metrics.connectionType && (
            <div className="text-blue-400">
              Connection: {metrics.connectionType}
            </div>
          )}
          <div className={`${isLowEndDevice ? 'text-yellow-400' : 'text-green-400'}`}>
            Device: {isLowEndDevice ? 'Low-end' : 'High-end'}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {children}
      <MetricsDisplay />
    </>
  );
};

// Hook for performance-aware component rendering
export const usePerformanceOptimization = () => {
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  const [shouldLazyLoad, setShouldLazyLoad] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check device capabilities
    const cores = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory || 4;
    const isLowEnd = cores <= 2 || memory <= 2;
    
    // Check connection
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || 'unknown';
    
    setShouldReduceAnimations(prefersReducedMotion || isLowEnd);
    setShouldLazyLoad(effectiveType === 'slow-2g' || effectiveType === '2g');
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      setConnectionSpeed('slow');
    } else if (effectiveType === '3g' || effectiveType === '4g') {
      setConnectionSpeed('fast');
    }
  }, []);

  return {
    shouldReduceAnimations,
    shouldLazyLoad,
    connectionSpeed,
    // Helper function to get optimized animation props
    getAnimationProps: (defaultProps: any) => {
      if (shouldReduceAnimations) {
        return {
          ...defaultProps,
          transition: { duration: 0.1 },
          animate: { ...defaultProps.animate, transition: { duration: 0.1 } }
        };
      }
      return defaultProps;
    },
    // Helper function for conditional lazy loading
    getLazyLoadProps: () => ({
      loading: shouldLazyLoad ? 'lazy' : 'eager',
      decoding: 'async'
    })
  };
};

export default PerformanceOptimizer;
