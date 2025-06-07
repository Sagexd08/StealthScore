#!/bin/bash

# Deploy Stealth Score to Firebase with Environment Variables
# This script builds the app with production environment variables and deploys

echo "🚀 Building and Deploying Stealth Score to Firebase..."

# Navigate to frontend directory
cd frontend

# Create production environment file
echo "📝 Creating production environment configuration..."
cat > .env.production << EOF
# Stealth Score Production Environment
# Auto-generated for Firebase deployment

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2hpZWYtZm93bC01MC5jbGVyay5hY2NvdW50cy5kZXYk

# OpenRouter API Key
VITE_OPENROUTER_API_KEY=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

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RX8BaQ2zh4A4B4J42ZjWUo7SnCEzrqLWeC0GVVzmNxfQjTCB4on9Gt4YRXRBwb8LoZjLXefhNpm1vzVsfVWePje00stlteGEy

# Backend API URL
VITE_API_URL=https://your-backend-api.herokuapp.com

# Application Configuration
VITE_APP_NAME=Stealth Score
VITE_APP_VERSION=2.0.0
VITE_APP_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_TEE=true
VITE_ENABLE_ZK_PROOFS=true
VITE_ENABLE_FEDERATED_LEARNING=true
VITE_ENABLE_WEB3=true
VITE_ENABLE_STRIPE_PAYMENTS=true
VITE_ENABLE_CRYPTO_PAYMENTS=true

# Deployment
VITE_FIREBASE_URL=https://pitchguard-2e687.web.app

# Security
VITE_ENABLE_CSP=true
VITE_ENABLE_HTTPS_ONLY=true
EOF

echo "✅ Production environment file created"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application for production..."
npm run build

# Go back to root directory
cd ..

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://pitchguard-2e687.web.app"
echo "🔐 Authentication is now properly configured with Clerk"
