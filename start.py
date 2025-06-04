#!/usr/bin/env python3
"""
PitchGuard Lite Startup Script
Helps users get the application running quickly
"""

import os
import sys
import subprocess
import webbrowser
import time
import platform
from pathlib import Path

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
    
    # Change to backend directory
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return None
    
    try:
        # Start uvicorn server
        process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", "app:app", 
            "--host", "0.0.0.0", "--port", "8000", "--reload"
        ], cwd=backend_dir)
        
        # Wait a moment for server to start
        time.sleep(3)
        
        # Check if process is still running
        if process.poll() is None:
            print("✅ Backend server started on http://localhost:8000")
            return process
        else:
            print("❌ Backend server failed to start")
            return None
            
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None

def open_frontend():
    """Open the frontend in the default browser"""
    frontend_path = Path("frontend/index.html").absolute()
    
    if not frontend_path.exists():
        print("❌ Frontend file not found")
        return False
    
    try:
        # Open in default browser
        webbrowser.open(f"file://{frontend_path}")
        print(f"🌐 Frontend opened in browser: {frontend_path}")
        return True
    except Exception as e:
        print(f"⚠️  Could not open browser automatically: {e}")
        print(f"   Please open this file manually: {frontend_path}")
        return False

def run_backend_test():
    """Run the backend test suite"""
    print("🧪 Running backend tests...")
    
    test_script = Path("backend/test_backend.py")
    if not test_script.exists():
        print("⚠️  Test script not found, skipping tests")
        return True
    
    try:
        result = subprocess.run([
            sys.executable, str(test_script)
        ], capture_output=True, text=True, timeout=60)
        
        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)
        
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("⚠️  Tests timed out")
        return False
    except Exception as e:
        print(f"⚠️  Could not run tests: {e}")
        return False

def main():
    """Main startup sequence"""
    print("🔒 PitchGuard Lite - Startup Script")
    print("=" * 50)
    
    # Pre-flight checks
    if not check_python_version():
        return 1
    
    has_api_key = check_openrouter_key()
    
    # Install dependencies
    if not install_backend_dependencies():
        return 1
    
    print("\n🚀 Starting Application...")
    print("-" * 30)
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        return 1
    
    try:
        # Wait for backend to be ready
        print("⏳ Waiting for backend to be ready...")
        time.sleep(5)
        
        # Run tests if API key is available
        if has_api_key:
            print("\n🧪 Running quick tests...")
            run_backend_test()
        
        # Open frontend
        print("\n🌐 Opening frontend...")
        open_frontend()
        
        print("\n" + "=" * 50)
        print("🎉 PitchGuard Lite is now running!")
        print("\n📍 URLs:")
        print("   Frontend: file://frontend/index.html")
        print("   Backend API: http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
        
        if not has_api_key:
            print("\n⚠️  Note: Set OPENROUTER_API_KEY to enable AI scoring")
        
        print("\n💡 Usage:")
        print("   1. Enter your startup pitch in the textarea")
        print("   2. Click 'Analyze Pitch' to get AI scores")
        print("   3. View results and save your receipt hash")
        
        print("\n🛑 Press Ctrl+C to stop the backend server")
        
        # Keep the backend running
        backend_process.wait()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down...")
        backend_process.terminate()
        backend_process.wait()
        print("✅ Backend stopped")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())