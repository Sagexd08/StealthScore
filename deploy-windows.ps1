# PitchGuard Windows Deployment Script
# PowerShell script for easy deployment on Windows

Write-Host "🛡️ PitchGuard - OnlyFounders AI Hackathon Deployment" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`n🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please ensure npm is installed with Node.js" -ForegroundColor Red
    exit 1
}

# Check environment variables
Write-Host "`n🔍 Checking environment variables..." -ForegroundColor Yellow
if (-not $env:OPENROUTER_API_KEY) {
    Write-Host "❌ OPENROUTER_API_KEY not set" -ForegroundColor Red
    Write-Host "Please set it with: `$env:OPENROUTER_API_KEY='your_key_here'" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ OPENROUTER_API_KEY is set" -ForegroundColor Green
}

# Navigate to frontend directory
Write-Host "`n📂 Navigating to frontend directory..." -ForegroundColor Yellow
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Frontend directory not found" -ForegroundColor Red
    exit 1
}

Set-Location frontend

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build for production
Write-Host "`n🔨 Building for production..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Check if dist directory exists
if (Test-Path "dist") {
    Write-Host "✅ Build output found in dist/ directory" -ForegroundColor Green
    $distSize = (Get-ChildItem -Recurse dist | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "📊 Build size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build output directory not found" -ForegroundColor Red
    exit 1
}

# Go back to root directory
Set-Location ..

# Create deployment info
Write-Host "`n📋 Creating deployment information..." -ForegroundColor Yellow
$deploymentInfo = @{
    project = "PitchGuard - OnlyFounders AI Hackathon"
    version = "2.0.0"
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    build_status = "success"
    features = @(
        "Privacy-Preserving AI with TEE simulation",
        "Federated Learning with Differential Privacy", 
        "Zero-Knowledge Proofs for verification",
        "Decentralized Identity (DID) integration",
        "Trust Graph reputation system",
        "Advanced UI with GSAP + Framer Motion",
        "Web3 wallet integration",
        "MetaMask smart contract deployment",
        "Pricing system with crypto payments"
    )
    deployment = @{
        platform = "Static Hosting"
        repository = "https://github.com/Sagexd08/PitchGuard"
        root_directory = "frontend"
        build_command = "npm run build"
        output_directory = "dist"
    }
}

$deploymentInfo | ConvertTo-Json -Depth 3 | Out-File "deployment-info.json" -Encoding UTF8
Write-Host "✅ Deployment info saved to deployment-info.json" -ForegroundColor Green

# Final summary
Write-Host "`n" -NoNewline
Write-Host "🎉 DEPLOYMENT READY!" -ForegroundColor Green -BackgroundColor Black
Write-Host "================================================================" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. 📤 Commit and push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'feat: Complete OnlyFounders AI hackathon submission'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray

Write-Host "`n2. 🚀 Deploy to hosting platform:" -ForegroundColor White
Write-Host "   - Choose your preferred hosting platform" -ForegroundColor Gray
Write-Host "   - Import Sagexd08/PitchGuard repository" -ForegroundColor Gray
Write-Host "   - Set root directory to 'frontend'" -ForegroundColor Gray
Write-Host "   - Add OPENROUTER_API_KEY environment variable" -ForegroundColor Gray
Write-Host "   - Deploy!" -ForegroundColor Gray

Write-Host "`n3. 🏆 Submit to hackathon with:" -ForegroundColor White
Write-Host "   - Live demo URL" -ForegroundColor Gray
Write-Host "   - GitHub repository" -ForegroundColor Gray
Write-Host "   - HACKATHON_SUBMISSION.md" -ForegroundColor Gray

Write-Host "`n🛡️ PitchGuard is ready to revolutionize fundraising!" -ForegroundColor Cyan

# Optional: Start local preview
Write-Host "`n🌐 Would you like to preview the build locally? (y/n): " -ForegroundColor Yellow -NoNewline
$preview = Read-Host
if ($preview -eq "y" -or $preview -eq "Y") {
    Write-Host "🚀 Starting local preview server..." -ForegroundColor Yellow
    Set-Location frontend
    npx serve -s dist -l 3000
}
