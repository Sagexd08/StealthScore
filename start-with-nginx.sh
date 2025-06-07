#!/bin/bash

# Stealth Score - Complete Setup with Nginx Proxy
# This script sets up the entire application stack with nginx proxy

set -e

echo "🚀 Starting Stealth Score with Nginx Proxy..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check for environment variables
if [ -z "$OPENROUTER_API_KEY" ]; then
    print_warning "OPENROUTER_API_KEY not set. Using demo mode."
    export OPENROUTER_API_KEY="demo_key"
fi

# Set default Stripe keys if not provided
if [ -z "$STRIPE_SECRET_KEY" ]; then
    print_warning "STRIPE_SECRET_KEY not set. Stripe payments will be disabled."
    export STRIPE_SECRET_KEY=""
fi

if [ -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    print_warning "STRIPE_PUBLISHABLE_KEY not set. Stripe payments will be disabled."
    export STRIPE_PUBLISHABLE_KEY=""
fi

# Create SSL directory for certificates (if needed)
if [ ! -d "ssl" ]; then
    print_status "Creating SSL directory for certificates..."
    mkdir -p ssl
fi

# Build frontend first to ensure dist directory exists
print_status "Building frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

print_status "Building frontend for production..."
npm run build

cd ..

# Ensure nginx.conf exists
if [ ! -f "nginx.conf" ]; then
    print_error "nginx.conf not found. Please ensure the nginx configuration file exists."
    exit 1
fi

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans

# Build and start all services
print_status "Building and starting all services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Check if services are running
print_status "Checking service health..."

# Check nginx
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_success "Nginx proxy is running on http://localhost:80"
else
    print_warning "Nginx proxy may not be ready yet"
fi

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    print_success "Backend is running on http://localhost:8000"
else
    print_warning "Backend may not be ready yet"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is running on http://localhost:3000"
else
    print_warning "Frontend may not be ready yet"
fi

# Display access information
echo ""
echo "🎉 Stealth Score is now running!"
echo ""
echo "📱 Access the application:"
echo "   • Main Application (via Nginx): http://localhost:80"
echo "   • Frontend Direct: http://localhost:3000"
echo "   • Backend API: http://localhost:8000"
echo "   • API Documentation: http://localhost:8000/docs"
echo ""
echo "💳 Payment Configuration:"
echo "   • Stripe Card Payments: Enabled"
echo "   • MetaMask Crypto Payments: Enabled"
echo ""
echo "🔧 Management Commands:"
echo "   • View logs: docker-compose logs -f"
echo "   • Stop services: docker-compose down"
echo "   • Restart services: docker-compose restart"
echo ""
echo "🌐 For production deployment:"
echo "   • Configure SSL certificates in ./ssl/ directory"
echo "   • Update nginx.conf with your domain"
echo "   • Set production environment variables"
echo ""

# Show running containers
print_status "Running containers:"
docker-compose ps

echo ""
print_success "Setup complete! Visit http://localhost:80 to access Stealth Score"
