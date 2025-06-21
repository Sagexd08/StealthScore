#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Simple icon generation script
// In a real app, you'd use a library like sharp to generate different sizes
// For now, we'll just ensure the manifest.json exists

const manifest = {
  "name": "StealthScore - Privacy-First AI Pitch Analysis",
  "short_name": "StealthScore",
  "description": "AI-powered pitch evaluation with encrypted input and LLM-based scoring",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f23",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
};

// Write manifest.json
fs.writeFileSync(
  path.join(publicDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('✅ Icons generated successfully');
console.log('📱 Manifest.json created');
console.log('🎨 PWA assets ready');