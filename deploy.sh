#!/bin/bash

# Stealth Score - Deployment Script
# This script builds and deploys the application to Firebase

echo "🚀 Starting Stealth Score deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live at: https://stealth-score.web.app"
else
    echo "❌ Deployment failed"
    exit 1
fi

echo "🎉 Stealth Score deployment complete!"
