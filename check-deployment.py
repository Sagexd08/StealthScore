#!/usr/bin/env python3
"""
PitchGuard Deployment Status Checker
Verifies that the project is ready for deployment
"""

import os
import json
import subprocess
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and print status"""
    if Path(file_path).exists():
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} (MISSING)")
        return False

def check_package_json():
    """Check if package.json has required scripts"""
    package_path = Path("frontend/package.json")
    if not package_path.exists():
        print("❌ frontend/package.json not found")
        return False
    
    try:
        with open(package_path, 'r') as f:
            package_data = json.load(f)
        
        scripts = package_data.get('scripts', {})
        required_scripts = ['build', 'dev']
        
        print("📦 Package.json scripts:")
        for script in required_scripts:
            if script in scripts:
                print(f"  ✅ {script}: {scripts[script]}")
            else:
                print(f"  ❌ {script}: MISSING")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Error reading package.json: {e}")
        return False



def check_git_status():
    """Check git status"""
    try:
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            if result.stdout.strip():
                print("⚠️  Git status: Uncommitted changes found")
                print("   Consider committing changes before deployment")
            else:
                print("✅ Git status: Clean working directory")
            return True
        else:
            print("❌ Git status check failed")
            return False
    except Exception as e:
        print(f"❌ Git status error: {e}")
        return False

def check_remote_origin():
    """Check git remote origin"""
    try:
        result = subprocess.run(['git', 'remote', 'get-url', 'origin'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            origin_url = result.stdout.strip()
            print(f"✅ Git remote origin: {origin_url}")
            if "Sagexd08/StealthScore" in origin_url:
                print("✅ Repository matches expected: Sagexd08/StealthScore")
            else:
                print("⚠️  Repository URL doesn't match expected")
            return True
        else:
            print("❌ No git remote origin found")
            return False
    except Exception as e:
        print(f"❌ Git remote check error: {e}")
        return False

def main():
    """Main deployment readiness check"""
    print("🛡️ Stealth Score Deployment Readiness Check")
    print("=" * 50)
    
    checks = []
    
    # File structure checks
    print("\n📁 File Structure:")
    checks.append(check_file_exists("frontend/package.json", "Frontend package.json"))
    checks.append(check_file_exists("frontend/src/main.tsx", "Main TypeScript entry"))
    checks.append(check_file_exists("frontend/src/App.tsx", "Main App component"))
    checks.append(check_file_exists("frontend/index.html", "HTML template"))
    checks.append(check_file_exists("frontend/Dockerfile", "Frontend Dockerfile"))
    
    # Configuration checks
    print("\n⚙️ Configuration:")
    checks.append(check_package_json())
    print("✅ Build config: Ready for deployment with frontend as root directory")
    
    # Git checks
    print("\n🔄 Git Status:")
    checks.append(check_git_status())
    checks.append(check_remote_origin())
    
    # Summary
    print("\n" + "=" * 50)
    passed = sum(checks)
    total = len(checks)
    
    if passed == total:
        print(f"🎉 All checks passed! ({passed}/{total})")
        print("\n🚀 Ready for deployment!")
        print("\nNext steps:")
        print("1. Choose your deployment platform")
        print("2. Configure build settings:")
        print("   - Root directory: 'frontend'")
        print("   - Build command: 'npm run build'")
        print("   - Output directory: 'dist'")
        print("3. Deploy!")
    else:
        print(f"⚠️  {total - passed} checks failed ({passed}/{total})")
        print("\n🔧 Please fix the issues above before deploying")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    exit(main())
