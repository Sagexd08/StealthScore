#!/bin/bash

echo "🚀 Stealth Score - Firebase Deployment"
echo "======================================"

cd frontend

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building application..."
npm run build

echo "🔥 Deploying to Firebase..."
cd ..
firebase deploy --only hosting

echo "✅ Deployment completed!"
echo "🌐 Your app is live at: https://pitchguard-2e687.web.app"
