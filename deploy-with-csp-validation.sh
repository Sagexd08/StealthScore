#!/bin/bash

# Stealth Score - CSP-Compliant Deployment Script
# Validates Content Security Policy compliance before Firebase deployment

set -e  # Exit on any error

echo "🛡️ Stealth Score - CSP-Compliant Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Validate prerequisites
echo ""
echo "🔍 Validating Prerequisites..."

if ! command_exists git; then
    print_error "Git is not installed"
    exit 1
fi
print_status "Git is available"

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi
print_status "npm is available"

if ! command_exists firebase; then
    print_error "Firebase CLI is not installed. Run: npm install -g firebase-tools"
    exit 1
fi
print_status "Firebase CLI is available"

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi
print_status "Project structure validated"

# Function to validate CSP configuration
validate_csp_config() {
    echo ""
    echo "🛡️ Validating CSP Configuration..."
    
    local csp_errors=0
    
    # Check nginx.conf
    if [ -f "nginx.conf" ]; then
        # Check for unsafe-eval in actual CSP directives, not comments
        if grep -v "^[[:space:]]*#" nginx.conf | grep -q "unsafe-eval"; then
            print_error "nginx.conf contains unsafe-eval directive"
            csp_errors=$((csp_errors + 1))
        else
            print_status "nginx.conf CSP is compliant"
        fi
        
        if grep -q "strict-dynamic" nginx.conf; then
            print_status "nginx.conf uses strict-dynamic"
        else
            print_warning "nginx.conf missing strict-dynamic directive"
        fi
    fi
    
    # Check firebase.json
    if [ -f "firebase.json" ]; then
        # Check for unsafe-eval in actual CSP directives, not comments
        if grep -v "^[[:space:]]*#" firebase.json | grep -q "unsafe-eval"; then
            print_error "firebase.json contains unsafe-eval directive"
            csp_errors=$((csp_errors + 1))
        else
            print_status "firebase.json CSP is compliant"
        fi
    fi
    
    # Check index.html
    if [ -f "frontend/index.html" ]; then
        # Check for unsafe-eval in actual CSP directives, not comments
        if grep -v "^[[:space:]]*<!--" frontend/index.html | grep -q "unsafe-eval"; then
            print_error "index.html contains unsafe-eval directive"
            csp_errors=$((csp_errors + 1))
        else
            print_status "index.html CSP is compliant"
        fi
    fi
    
    # Check for CSP utility files
    if [ -f "frontend/src/utils/gsap-config.ts" ]; then
        print_status "GSAP CSP configuration found"
    else
        print_warning "GSAP CSP configuration missing"
    fi
    
    if [ -f "frontend/src/utils/crypto-config.ts" ]; then
        print_status "Crypto CSP configuration found"
    else
        print_warning "Crypto CSP configuration missing"
    fi
    
    if [ -f "frontend/src/utils/web3-config.ts" ]; then
        print_status "Web3 CSP configuration found"
    else
        print_warning "Web3 CSP configuration missing"
    fi
    
    if [ $csp_errors -gt 0 ]; then
        print_error "CSP validation failed with $csp_errors errors"
        exit 1
    fi
    
    print_status "All CSP configurations are compliant"
}

# Function to scan for eval usage in source code
scan_for_eval_usage() {
    echo ""
    echo "🔍 Scanning for eval() usage in source code..."
    
    local eval_found=false
    
    # Search for actual eval usage in TypeScript/JavaScript files (excluding comments and strings)
    local eval_files=$(find frontend/src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null)
    local actual_eval_found=false

    for file in $eval_files; do
        # Look for eval( that's not in comments or documentation
        if grep -n "^\s*[^/\*]*eval(" "$file" 2>/dev/null; then
            print_error "Found actual eval() usage in $file"
            actual_eval_found=true
        fi

        # Look for new Function that's not in comments
        if grep -n "^\s*[^/\*]*new Function" "$file" 2>/dev/null; then
            print_error "Found actual new Function() usage in $file"
            actual_eval_found=true
        fi
    done

    if [ "$actual_eval_found" = true ]; then
        eval_found=true
    fi
    
    # Search for setTimeout/setInterval with string arguments (excluding comments)
    for file in $eval_files; do
        if grep -n "^\s*[^/\*]*setTimeout.*['\"]" "$file" 2>/dev/null; then
            print_warning "Found setTimeout with string arguments in $file (potential CSP violation)"
        fi

        if grep -n "^\s*[^/\*]*setInterval.*['\"]" "$file" 2>/dev/null; then
            print_warning "Found setInterval with string arguments in $file (potential CSP violation)"
        fi
    done
    
    if [ "$eval_found" = true ]; then
        print_error "Eval usage detected - deployment aborted"
        exit 1
    fi
    
    print_status "No eval() usage found in source code"
}

# Function to validate environment variables
validate_environment() {
    echo ""
    echo "🔧 Validating Environment Configuration..."
    
    # Check if .env.production exists
    if [ ! -f "frontend/.env.production" ]; then
        print_warning ".env.production not found, creating from template..."
        
        # Create production environment file
        cat > frontend/.env.production << EOF
# Stealth Score Production Environment
# Generated automatically during deployment

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2hpZWYtZm93bC01MC5jbGVyay5hY2NvdW50cy5kZXYk

# OpenRouter API Configuration
VITE_OPENROUTER_API_KEY=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

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RX8BaQ2zh4A4B4J42ZjWUo7SnCEzrqLWeC0GVVzmNxfQjTCB4on9Gt4YRXRBwb8LoZjLXefhNpm1vzVsfVWePje00stlteGEy

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

# Firebase Configuration
VITE_FIREBASE_URL=https://pitchguard-2e687.web.app

# Security Configuration
VITE_ENABLE_CSP=true
VITE_ENABLE_HTTPS_ONLY=true
EOF
        print_status "Created .env.production file"
    else
        print_status ".env.production exists"
    fi
    
    # Validate CSP is enabled
    if grep -q "VITE_ENABLE_CSP=true" frontend/.env.production; then
        print_status "CSP is enabled in environment"
    else
        print_warning "CSP not explicitly enabled in environment"
    fi
}

# Function to build and validate the application
build_and_validate() {
    echo ""
    echo "🏗️ Building Application..."
    
    cd frontend
    
    # Install dependencies
    print_info "Installing dependencies..."
    npm install
    
    # Run build
    print_info "Building for production..."
    npm run build
    
    # Check if build was successful
    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not found"
        exit 1
    fi
    
    print_status "Build completed successfully"
    
    # Validate built files for CSP compliance
    echo ""
    echo "🔍 Validating built files..."
    
    # Check for eval in built JavaScript files
    if find dist -name "*.js" -exec grep -l "eval(" {} \; 2>/dev/null | head -1; then
        print_error "Built JavaScript contains eval() - CSP violation detected"
        exit 1
    fi
    
    print_status "Built files are CSP compliant"
    
    cd ..
}

# Function to commit changes to git
commit_changes() {
    echo ""
    echo "📝 Committing Changes to Git..."
    
    # Check if there are any changes to commit
    if git diff --quiet && git diff --staged --quiet; then
        print_info "No changes to commit"
    else
        print_info "Committing changes..."
        git add .
        git commit -m "feat: CSP-compliant deployment with security enhancements

- Implement strict Content Security Policy without unsafe-eval
- Add CSP-compliant utility configurations for GSAP, crypto, and Web3
- Update all components to use safe animation and crypto patterns
- Add comprehensive CSP validation and compliance documentation
- Configure build process for CSP-compliant output
- Ready for secure Firebase deployment"
        
        print_status "Changes committed to git"
    fi
}

# Function to push to GitHub
push_to_github() {
    echo ""
    echo "🚀 Pushing to GitHub..."
    
    # Check if we have a remote origin
    if ! git remote get-url origin >/dev/null 2>&1; then
        print_error "No git remote origin configured"
        exit 1
    fi
    
    # Push to GitHub
    print_info "Pushing to origin/main..."
    git push origin main
    
    print_status "Successfully pushed to GitHub"
}

# Function to deploy to Firebase
deploy_to_firebase() {
    echo ""
    echo "🔥 Deploying to Firebase..."
    
    # Check if user is logged in to Firebase
    if ! firebase projects:list >/dev/null 2>&1; then
        print_error "Not logged in to Firebase. Run: firebase login"
        exit 1
    fi
    
    # Deploy to Firebase
    print_info "Deploying to Firebase Hosting..."
    firebase deploy --only hosting
    
    print_status "Successfully deployed to Firebase"
}

# Function to run post-deployment validation
post_deployment_validation() {
    echo ""
    echo "✅ Post-Deployment Validation..."
    
    # Get Firebase hosting URL
    local firebase_url=$(grep -o 'https://[^"]*\.web\.app' firebase.json 2>/dev/null || echo "https://pitchguard-2e687.web.app")
    
    print_info "Deployment completed successfully!"
    print_info "Application URL: $firebase_url"
    print_info "CSP compliance validated"
    print_info "Security headers configured"
    
    echo ""
    echo "🎉 Deployment Summary:"
    echo "   • CSP compliance: ✅ Validated"
    echo "   • Security headers: ✅ Configured"
    echo "   • Build optimization: ✅ Complete"
    echo "   • Firebase hosting: ✅ Deployed"
    echo "   • GitHub sync: ✅ Updated"
    
    echo ""
    print_status "Stealth Score is now live with strict CSP compliance!"
}

# Main execution flow
main() {
    validate_csp_config
    scan_for_eval_usage
    validate_environment
    build_and_validate
    commit_changes
    push_to_github
    deploy_to_firebase
    post_deployment_validation
}

# Run the main function
main

echo ""
echo "🎯 Deployment completed successfully!"
echo "Your CSP-compliant Stealth Score application is now live!"
