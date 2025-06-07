import { toast } from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallManager {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  showInstallPrompt: () => Promise<boolean>;
  checkInstallStatus: () => void;
  registerServiceWorker: () => Promise<void>;
  updateServiceWorker: () => Promise<void>;
  enableNotifications: () => Promise<boolean>;
  trackInstallation: () => void;
}

class PWAManager implements PWAInstallManager {
  public isInstallable = false;
  public isInstalled = false;
  public isStandalone = false;
  public installPrompt: BeforeInstallPromptEvent | null = null;

  constructor() {
    this.init();
  }

  private init() {
    this.checkInstallStatus();
    this.setupInstallPromptListener();
    this.setupAppInstalledListener();
    this.registerServiceWorker();
  }

  private setupInstallPromptListener() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable = true;

      setTimeout(() => {
        this.showInstallBanner();
      }, 3000);
    });
  }

  private setupAppInstalledListener() {
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.isInstallable = false;
      this.installPrompt = null;
      this.trackInstallation();
      
      toast.success('🎉 Stealth Score installed successfully!', {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
        },
      });
    });
  }

  public checkInstallStatus() {
    
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    this.isInstalled = this.isStandalone;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode) {
      this.showIOSInstallInstructions();
    }
  }

  public async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      toast.error('Installation not available on this device');
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choiceResult = await this.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        this.trackInstallation();
        return true;
      } else {
        toast('Installation cancelled', {
          icon: '📱',
          style: {
            background: '#374151',
            color: 'white',
          },
        });
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      toast.error('Failed to show install prompt');
      return false;
    }
  }

  private showInstallBanner() {
    if (this.isInstalled || !this.isInstallable) return;

    toast((t) => (
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">📱</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Install Stealth Score</p>
          <p className="text-xs text-gray-500">Get the full app experience</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              this.showInstallPrompt();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          >
            Install
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'bottom-center',
      style: {
        background: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        maxWidth: '400px',
      },
    });
  }

  private showIOSInstallInstructions() {
    toast((t) => (
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 mb-2">Install Stealth Score</p>
        <p className="text-xs text-gray-600 mb-3">
          Tap the share button <span className="font-mono">⬆️</span> and select "Add to Home Screen"
        </p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          Got it
        </button>
      </div>
    ), {
      duration: 8000,
      position: 'bottom-center',
      style: {
        background: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        maxWidth: '300px',
      },
    });
  }

  public async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker registered:', registration);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateAvailable(registration);
            }
          });
        }
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private showUpdateAvailable(registration: ServiceWorkerRegistration) {
    toast((t) => (
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🔄</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Update Available</p>
          <p className="text-xs text-gray-500">New features and improvements</p>
        </div>
        <button
          onClick={() => {
            this.updateServiceWorker();
            toast.dismiss(t.id);
          }}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
        >
          Update
        </button>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  }

  public async updateServiceWorker(): Promise<void> {
    if (!navigator.serviceWorker.controller) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  public async enableNotifications(): Promise<boolean> {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported on this device');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      toast.error('Notifications are blocked. Please enable them in browser settings.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        return true;
      } else {
        toast('Notifications disabled');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  public trackInstallation() {
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install', {
        event_category: 'PWA',
        event_label: 'App Installation',
        value: 1
      });
    }

    localStorage.setItem('pwa_installed', Date.now().toString());
    localStorage.setItem('pwa_install_source', 'browser_prompt');
  }
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public measurePageLoad() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.metrics.set('dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
      this.metrics.set('tcp_connect', navigation.connectEnd - navigation.connectStart);
      this.metrics.set('request_response', navigation.responseEnd - navigation.requestStart);
      this.metrics.set('dom_processing', navigation.domContentLoadedEventEnd - navigation.responseEnd);
      this.metrics.set('total_load_time', navigation.loadEventEnd - navigation.navigationStart);
    }
  }

  public measureCoreWebVitals() {
    
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('lcp', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.set('fid', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.set('cls', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

export const pwaManager = new PWAManager();
export const performanceMonitor = PerformanceMonitor.getInstance();

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    performanceMonitor.measurePageLoad();
    performanceMonitor.measureCoreWebVitals();
  });
}
