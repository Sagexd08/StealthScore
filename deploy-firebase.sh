#!/bin/bash

# Advanced Firebase Deployment Script for Stealth Score PWA
# This script builds and deploys the application with optimizations

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="stealth-score"
FRONTEND_DIR="frontend"
BUILD_DIR="dist"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI is not installed. Installing..."
        npm install -g firebase-tools
    fi
    
    print_success "All dependencies are available"
}

setup_environment() {
    print_status "Setting up environment variables..."
    
    # Check if .env.local exists
    if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
        print_warning ".env.local not found. Creating from template..."
        
        if [ -f "$FRONTEND_DIR/.env.example" ]; then
            cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.local"
            print_warning "Please update $FRONTEND_DIR/.env.local with your actual API keys"
        else
            print_error ".env.example not found. Please create environment configuration."
            exit 1
        fi
    fi
    
    # Validate critical environment variables
    if [ -f "$FRONTEND_DIR/.env.local" ]; then
        source "$FRONTEND_DIR/.env.local"
        
        if [ -z "$VITE_OPENROUTER_API_KEY" ] || [ "$VITE_OPENROUTER_API_KEY" = "your_openrouter_api_key_here" ]; then
            print_warning "VITE_OPENROUTER_API_KEY not set or using placeholder value"
        fi
        
        if [ -z "$VITE_STRIPE_PUBLISHABLE_KEY" ] || [ "$VITE_STRIPE_PUBLISHABLE_KEY" = "your_stripe_publishable_key_here" ]; then
            print_warning "VITE_STRIPE_PUBLISHABLE_KEY not set or using placeholder value"
        fi
    fi
    
    print_success "Environment setup complete"
}

install_dependencies() {
    print_status "Installing frontend dependencies..."
    
    cd "$FRONTEND_DIR"
    
    # Clean install
    if [ -d "node_modules" ]; then
        print_status "Cleaning existing node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        rm package-lock.json
    fi
    
    # Install dependencies
    npm install
    
    print_success "Dependencies installed successfully"
    cd ..
}

optimize_build() {
    print_status "Building optimized production bundle..."
    
    cd "$FRONTEND_DIR"
    
    # Set production environment
    export NODE_ENV=production
    export VITE_APP_ENVIRONMENT=production
    
    # Build with optimizations
    npm run build
    
    # Check if build was successful
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build failed - $BUILD_DIR directory not found"
        exit 1
    fi
    
    print_success "Build completed successfully"
    
    # Display build size information
    print_status "Build size analysis:"
    du -sh "$BUILD_DIR"
    
    # Check for large files
    find "$BUILD_DIR" -type f -size +1M -exec ls -lh {} \; | awk '{print $5 " " $9}' | sort -hr
    
    cd ..
}

optimize_assets() {
    print_status "Optimizing assets..."
    
    cd "$FRONTEND_DIR/$BUILD_DIR"
    
    # Compress images if imagemin is available
    if command -v imagemin &> /dev/null; then
        print_status "Compressing images..."
        find . -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs imagemin --out-dir=.
    fi
    
    # Generate gzip files for static assets
    print_status "Pre-compressing static assets..."
    find . -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" \) -exec gzip -9 -k {} \;
    
    # Generate brotli files if brotli is available
    if command -v brotli &> /dev/null; then
        print_status "Creating Brotli compressed files..."
        find . -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.json" \) -exec brotli -q 11 -k {} \;
    fi
    
    print_success "Asset optimization complete"
    cd ../..
}

setup_firebase() {
    print_status "Setting up Firebase configuration..."
    
    # Check if firebase.json exists
    if [ ! -f "firebase.json" ]; then
        print_status "Initializing Firebase project..."
        firebase init hosting
    fi
    
    # Login to Firebase if not already logged in
    if ! firebase projects:list &> /dev/null; then
        print_status "Logging into Firebase..."
        firebase login
    fi
    
    print_success "Firebase setup complete"
}

deploy_to_firebase() {
    print_status "Deploying to Firebase Hosting..."
    
    # Deploy with custom message
    DEPLOY_MESSAGE="Deploy $(date '+%Y-%m-%d %H:%M:%S') - Advanced PWA with performance optimizations"
    
    firebase deploy --only hosting --message "$DEPLOY_MESSAGE"
    
    if [ $? -eq 0 ]; then
        print_success "Deployment successful!"
        
        # Get the hosting URL
        HOSTING_URL=$(firebase hosting:channel:list | grep -o 'https://[^[:space:]]*' | head -1)
        if [ -n "$HOSTING_URL" ]; then
            print_success "Your app is live at: $HOSTING_URL"
        fi
    else
        print_error "Deployment failed"
        exit 1
    fi
}

cleanup() {
    print_status "Cleaning up temporary files..."
    
    cd "$FRONTEND_DIR"
    
    # Remove compressed files from build directory
    find "$BUILD_DIR" -name "*.gz" -delete
    find "$BUILD_DIR" -name "*.br" -delete
    
    print_success "Cleanup complete"
    cd ..
}

run_performance_audit() {
    print_status "Running performance audit..."
    
    # Check if lighthouse is available
    if command -v lighthouse &> /dev/null; then
        print_status "Running Lighthouse audit..."
        
        # Get the deployed URL
        HOSTING_URL=$(firebase hosting:channel:list | grep -o 'https://[^[:space:]]*' | head -1)
        
        if [ -n "$HOSTING_URL" ]; then
            lighthouse "$HOSTING_URL" --output=html --output-path=./lighthouse-report.html --chrome-flags="--headless"
            print_success "Lighthouse report generated: lighthouse-report.html"
        fi
    else
        print_warning "Lighthouse not installed. Skipping performance audit."
        print_status "Install with: npm install -g lighthouse"
    fi
}

# Main execution
main() {
    print_status "Starting Firebase deployment for Stealth Score PWA..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] && [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Execute deployment steps
    check_dependencies
    setup_environment
    install_dependencies
    optimize_build
    optimize_assets
    setup_firebase
    deploy_to_firebase
    cleanup
    run_performance_audit
    
    print_success "🚀 Deployment complete! Your advanced PWA is now live."
    print_status "Features deployed:"
    echo "  ✅ Progressive Web App with offline support"
    echo "  ✅ Advanced service worker with intelligent caching"
    echo "  ✅ Performance optimizations for all devices"
    echo "  ✅ Secure payment processing (Stripe + Crypto)"
    echo "  ✅ Privacy-preserving AI pitch analysis"
    echo "  ✅ Enhanced security headers and CSP"
    echo "  ✅ Responsive design with accessibility features"
}

# Run the main function
main "$@"
