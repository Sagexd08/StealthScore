/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  // experimental: {
  //   appDir: true,
  // },
  env: {
    NEXT_PUBLIC_OPENROUTER_API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    NEXT_PUBLIC_INFURA_PROJECT_ID: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_APP_ENVIRONMENT: process.env.NEXT_PUBLIC_APP_ENVIRONMENT,
    NEXT_PUBLIC_ENABLE_TEE: process.env.NEXT_PUBLIC_ENABLE_TEE,
    NEXT_PUBLIC_ENABLE_ZK_PROOFS: process.env.NEXT_PUBLIC_ENABLE_ZK_PROOFS,
    NEXT_PUBLIC_ENABLE_FEDERATED_LEARNING: process.env.NEXT_PUBLIC_ENABLE_FEDERATED_LEARNING,
    NEXT_PUBLIC_ENABLE_WEB3: process.env.NEXT_PUBLIC_ENABLE_WEB3,
    NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS,
    NEXT_PUBLIC_ENABLE_CRYPTO_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_CRYPTO_PAYMENTS,
    NEXT_PUBLIC_FIREBASE_URL: process.env.NEXT_PUBLIC_FIREBASE_URL,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_ENABLE_CSP: process.env.NEXT_PUBLIC_ENABLE_CSP,
    NEXT_PUBLIC_ENABLE_HTTPS_ONLY: process.env.NEXT_PUBLIC_ENABLE_HTTPS_ONLY,
  },
  webpack: (config, { isServer, webpack }) => {
    // Handle node polyfills for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
      };
      
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }



    // Handle GSAP licensing
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/gsap/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });

    return config;
  },
  images: {
    domains: ['localhost', 'pitchguard-2e687.web.app'],
    unoptimized: true,
  },
  // Enable static export for Firebase hosting (commented out for development)
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'out',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/StealthScore/' : '',
  // basePath: process.env.NODE_ENV === 'production' ? '/StealthScore' : '',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Headers commented out for development (not compatible with static export)
  // headers: async () => {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=(), microphone=(), geolocation=()',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
