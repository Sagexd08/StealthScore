// Icon generation script for PWA
// This script creates placeholder icon files for the PWA manifest

const fs = require('fs');
const path = require('path');

// Create SVG icon content
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 10}" fill="url(#grad)" />
  
  <!-- Shield shape -->
  <path d="M${size/2} ${size/4} L${size*3/4} ${size*3/8} L${size*3/4} ${size*5/8} Q${size*3/4} ${size*3/4} ${size/2} ${size*7/8} Q${size/4} ${size*3/4} ${size/4} ${size*5/8} L${size/4} ${size*3/8} Z" 
        fill="white" opacity="0.9"/>
  
  <!-- Center dot -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/16}" fill="white"/>
  
  <!-- Text -->
  <text x="${size/2}" y="${size - 20}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size/12}" font-weight="bold">PG</text>
</svg>
`;

// Create directories if they don't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icon files
const iconSizes = [192, 512];

iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated ${filename}`);
});

// Generate maskable icons (same content for now)
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-maskable-${size}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated ${filename}`);
});

// Generate shortcut icons
const shortcuts = ['analyze', 'results'];
shortcuts.forEach(shortcut => {
  const svgContent = createSVGIcon(96);
  const filename = `shortcut-${shortcut}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated ${filename}`);
});

// Generate apple touch icon
const appleTouchIcon = createSVGIcon(180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleTouchIcon.trim());
console.log('Generated apple-touch-icon.svg');

// Generate masked icon
const maskedIcon = createSVGIcon(512);
fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), maskedIcon.trim());
console.log('Generated masked-icon.svg');

console.log('All PWA icons generated successfully!');
console.log('Note: For production, consider converting SVG icons to PNG format for better compatibility.');
