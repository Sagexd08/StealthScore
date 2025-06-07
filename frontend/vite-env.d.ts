/// <reference types="vite/client" />

interface ImportMetaEnv {
  // OpenRouter API Configuration
  readonly VITE_OPENROUTER_API_KEY: string;
  
  // Stripe Payment Configuration
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  
  // Clerk Authentication Configuration
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  
  // Backend API Configuration
  readonly VITE_API_URL: string;
  
  // Web3 Configuration
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_INFURA_PROJECT_ID: string;
  
  // Application Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENVIRONMENT: string;
  
  // Feature Flags
  readonly VITE_ENABLE_TEE: string;
  readonly VITE_ENABLE_ZK_PROOFS: string;
  readonly VITE_ENABLE_FEDERATED_LEARNING: string;
  readonly VITE_ENABLE_WEB3: string;
  readonly VITE_ENABLE_STRIPE_PAYMENTS: string;
  readonly VITE_ENABLE_CRYPTO_PAYMENTS: string;
  
  // Firebase Configuration
  readonly VITE_FIREBASE_URL: string;
  
  // Analytics & Monitoring
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_SENTRY_DSN: string;
  
  // Security Configuration
  readonly VITE_ENABLE_CSP: string;
  readonly VITE_ENABLE_HTTPS_ONLY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Ethereum Provider Types
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress: string | null;
      chainId: string;
      networkVersion: string;
    };
  }
}

export {};
