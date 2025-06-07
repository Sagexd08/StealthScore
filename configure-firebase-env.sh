#!/bin/bash

# Configure Firebase Environment Variables for Stealth Score
# This script sets up all necessary environment variables for production deployment

echo "🔧 Configuring Firebase Environment Variables for Stealth Score..."

# Set Clerk Authentication
firebase functions:config:set \
  clerk.publishable_key="pk_test_Y2hpZWYtZm93bC01MC5jbGVyay5hY2NvdW50cy5kZXYk"

# Set OpenRouter API Key
firebase functions:config:set \
  openrouter.api_key="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"

# Set Stripe Configuration
firebase functions:config:set \
  stripe.publishable_key="pk_test_51RX8BaQ2zh4A4B4J42ZjWUo7SnCEzrqLWeC0GVVzmNxfQjTCB4on9Gt4YRXRBwb8LoZjLXefhNpm1vzVsfVWePje00stlteGEy"

# Set Application Configuration
firebase functions:config:set \
  app.name="Stealth Score" \
  app.version="2.0.0" \
  app.environment="production" \
  app.url="https://pitchguard-2e687.web.app"

# Set Feature Flags
firebase functions:config:set \
  features.tee="true" \
  features.zk_proofs="true" \
  features.federated_learning="true" \
  features.web3="true" \
  features.stripe_payments="true" \
  features.crypto_payments="true"

# Set Security Configuration
firebase functions:config:set \
  security.csp="true" \
  security.https_only="true"

echo "✅ Firebase environment variables configured successfully!"
echo "🚀 Ready for deployment with proper authentication!"

# Display current configuration
echo ""
echo "📋 Current Firebase Configuration:"
firebase functions:config:get
