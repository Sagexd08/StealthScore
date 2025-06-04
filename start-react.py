#!/usr/bin/env python3
"""
PitchGuard Lite React Startup Script
Enhanced version with React frontend
"""

import os
import sys
import subprocess
import webbrowser
import time
import platform
from pathlib import Path

def check_node_version():
    """Check if Node.js is installed and version is compatible"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Node.js {version} detected")
            return True
        else:
            print("❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required. Current version:", sys.version)
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def check_openrouter_key():
    """Check if OpenRouter API key is set"""
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("⚠️  OpenRouter API key not found!")
        print("   Get a free key at: https://openrouter.ai")
        print("   Then set it with:")
        if platform.system() == "Windows":
            print("   set OPENROUTER_API_KEY=your_key_here")
        else:
            print("   export OPENROUTER_API_KEY=your_key_here")
        return False
    print("✅ OpenRouter API key configured")
    return True

def install_frontend_dependencies():
    """Install React frontend dependencies"""
    print("📦 Installing frontend dependencies...")
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    try:
        subprocess.run([
            "npm", "install"
        ], cwd=frontend_dir, check=True, capture_output=True)
        print("✅ Frontend dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install frontend dependencies: {e}")
        return False

def install_backend_dependencies():
    """Install backend Python dependencies"""
    print("📦 Installing backend dependencies...")
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"
        ], check=True, capture_output=True)
        print("✅ Backend dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_backend():
    """Start the FastAPI backend"""
    print("🚀 Starting backend server...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return None
    
    try:
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", "app:app", 
            "--host", "0.0.0.0", "--port", "8000", "--reload"
        ], cwd=backend_dir)
        
        # Wait a moment for server to start
        time.sleep(3)
        
        if process.poll() is None:
            print("✅ Backend server started on http://localhost:8000")
            return process
        else:
            print("❌ Backend server failed to start")
            return None
            
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None

def start_frontend():
    """Start the React frontend development server"""
    print("🌐 Starting React frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return None
    
    try:
        process = subprocess.Popen([
            "npm", "run", "dev"
        ], cwd=frontend_dir)
        
        # Wait a moment for server to start
        time.sleep(5)
        
        if process.poll() is None:
            print("✅ Frontend server started on http://localhost:3000")
            return process
        else:
            print("❌ Frontend server failed to start")
            return None
            
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def open_browser():
    """Open the application in the default browser"""
    try:
        webbrowser.open("http://localhost:3000")
        print("🌐 Application opened in browser")
        return True
    except Exception as e:
        print(f"⚠️  Could not open browser automatically: {e}")
        print("   Please open http://localhost:3000 manually")
        return False

def main():
    """Main startup sequence"""
    print("🛡️ PitchGuard Lite - React Startup Script")
    print("=" * 50)
    
    # Pre-flight checks
    if not check_python_version():
        return 1
    
    if not check_node_version():
        return 1
    
    has_api_key = check_openrouter_key()
    
    # Install dependencies
    if not install_backend_dependencies():
        return 1
    
    if not install_frontend_dependencies():
        return 1
    
    print("\n🚀 Starting Application...")
    print("-" * 30)
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        return 1
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        backend_process.terminate()
        return 1
    
    try:
        # Wait for services to be ready
        print("⏳ Waiting for services to be ready...")
        time.sleep(3)
        
        # Open browser
        open_browser()
        
        print("\n" + "=" * 50)
        print("🎉 PitchGuard Lite is now running!")
        print("\n📍 URLs:")
        print("   Frontend (React): http://localhost:3000")
        print("   Backend API: http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
        
        if not has_api_key:
            print("\n⚠️  Note: Set OPENROUTER_API_KEY to enable AI scoring")
        
        print("\n💡 Features:")
        print("   🎨 Modern React UI with animations")
        print("   🔐 Client-side AES-256-GCM encryption")
        print("   🤖 AI-powered pitch analysis")
        print("   📊 Real-time scoring visualization")
        
        print("\n🛑 Press Ctrl+C to stop both servers")
        
        # Keep both processes running
        try:
            backend_process.wait()
        except KeyboardInterrupt:
            pass
        
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down...")
        
        print("Stopping frontend...")
        frontend_process.terminate()
        frontend_process.wait()
        
        print("Stopping backend...")
        backend_process.terminate()
        backend_process.wait()
        
        print("✅ All services stopped")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())