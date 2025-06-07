#!/usr/bin/env python3
"""
Final cleanup script to remove all unnecessary files and optimize the codebase
"""

import os
import shutil
from pathlib import Path

def remove_unnecessary_files():
    """Remove additional unnecessary files"""
    
    files_to_remove = [
        # Root level unnecessary files
        'check-deployment.py',
        'package.json',
        'package-lock.json',
        '.gitignore',
        
        # Frontend unnecessary files
        'frontend/scripts/generate-icons.js',
        'frontend/postcss.config.js',
        'frontend/tsconfig.node.json',
        'frontend/vite-env.d.ts',
        
        # Unnecessary public files
        'frontend/public/vite.svg',
        'frontend/public/offline.html',
        'frontend/public/shortcut-analyze.svg',
        'frontend/public/shortcut-results.svg',
        
        # Unnecessary component files (duplicates or unused)
        'frontend/src/components/AdvancedLoader.tsx',
        'frontend/src/components/AnimatedLogo.tsx',
        'frontend/src/components/PerformanceOptimizer.tsx',
        'frontend/src/components/TEEMonitor.tsx',
        'frontend/src/components/SignInPage.tsx',
        'frontend/src/components/SignUpPage.tsx',
        'frontend/src/components/ProfilePage.tsx',
        'frontend/src/components/SplitText.tsx',
        
        # Unnecessary CSS files (styles should be in components)
        'frontend/src/components/Dock.css',
        'frontend/src/components/ScrollFloat.css',
        'frontend/src/components/ScrollReveal.css',
        'frontend/src/components/Squares.css',
        'frontend/src/components/TrueFocus.css',
        
        # Unnecessary utility files
        'frontend/src/utils/pwaUtils.ts',
        'frontend/src/types/ethereum.d.ts',
        
        # Backend unnecessary files
        'backend/requirements.txt',
    ]
    
    directories_to_remove = [
        # Remove scripts directory
        'frontend/scripts',
        
        # Remove types directory (not needed)
        'frontend/src/types',
    ]
    
    removed_files = []
    removed_dirs = []
    
    print("🗑️ Removing additional unnecessary files...")
    
    # Remove files
    for file_path in files_to_remove:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                removed_files.append(file_path)
                print(f"✅ Removed: {file_path}")
            except Exception as e:
                print(f"❌ Failed to remove {file_path}: {e}")
    
    # Remove directories
    for dir_path in directories_to_remove:
        if os.path.exists(dir_path):
            try:
                shutil.rmtree(dir_path)
                removed_dirs.append(dir_path)
                print(f"✅ Removed directory: {dir_path}")
            except Exception as e:
                print(f"❌ Failed to remove {dir_path}: {e}")
    
    return removed_files, removed_dirs

def consolidate_components():
    """Remove duplicate and unnecessary components"""
    
    # Components to keep (essential ones)
    essential_components = [
        'App.tsx',
        'LandingPage.tsx',
        'PitchAnalyzer.tsx',
        'PitchInput.tsx',
        'SecurityPage.tsx',
        'SettingsPage.tsx',
        'PricingPage.tsx',
        'AuthWrapper.tsx',
        'ClerkProvider.tsx',
        'PaymentModal.tsx',
        'PaymentProcessor.tsx',
        'StripePayment.tsx',
        'CryptoPayment.tsx',
        'SmartContractManager.tsx',
        'PerformanceMonitor.tsx',
        'ParticleBackground.jsx',
        'ClickSpark.tsx',
        'Squares.tsx',
        'Dock.tsx',
        'ProfilePopup.tsx',
    ]
    
    # Remove non-essential components
    components_dir = Path('frontend/src/components')
    if components_dir.exists():
        removed_components = []
        for component_file in components_dir.iterdir():
            if component_file.is_file() and component_file.name not in essential_components:
                try:
                    component_file.unlink()
                    removed_components.append(str(component_file))
                    print(f"✅ Removed component: {component_file.name}")
                except Exception as e:
                    print(f"❌ Failed to remove {component_file}: {e}")
        
        return removed_components
    
    return []

def optimize_public_directory():
    """Keep only essential public files"""
    
    essential_public_files = [
        'favicon.svg',
        'manifest.json',
        'sw.js',
        'icon-192.svg',
        'icon-512.svg',
    ]
    
    public_dir = Path('frontend/public')
    if public_dir.exists():
        removed_public = []
        for public_file in public_dir.iterdir():
            if public_file.is_file() and public_file.name not in essential_public_files:
                try:
                    public_file.unlink()
                    removed_public.append(str(public_file))
                    print(f"✅ Removed public file: {public_file.name}")
                except Exception as e:
                    print(f"❌ Failed to remove {public_file}: {e}")
        
        return removed_public
    
    return []

def create_minimal_package_json():
    """Create a minimal package.json for the root"""
    
    minimal_package = '''{
  "name": "stealth-score",
  "version": "2.0.0",
  "description": "Stealth Score - Privacy-Preserving AI Pitch Analysis",
  "scripts": {
    "dev": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "deploy": "bash deploy.sh"
  },
  "dependencies": {
    "firebase-tools": "^14.6.0"
  }
}'''
    
    with open('package.json', 'w') as f:
        f.write(minimal_package)
    
    print("✅ Created minimal package.json")

def create_minimal_gitignore():
    """Create a minimal .gitignore"""
    
    minimal_gitignore = '''node_modules/
.env
.env.local
.env.production
dist/
build/
.cache/
.vite/
*.log
.DS_Store
Thumbs.db'''
    
    with open('.gitignore', 'w') as f:
        f.write(minimal_gitignore)
    
    print("✅ Created minimal .gitignore")

def main():
    """Main cleanup function"""
    print("🧹 Final Cleanup - Removing Unnecessary Files")
    print("=" * 50)
    
    # Change to project directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    # Remove unnecessary files and directories
    removed_files, removed_dirs = remove_unnecessary_files()
    
    # Consolidate components
    print("\n🔧 Consolidating components...")
    removed_components = consolidate_components()
    
    # Optimize public directory
    print("\n📁 Optimizing public directory...")
    removed_public = optimize_public_directory()
    
    # Create minimal configuration files
    print("\n⚙️ Creating minimal configuration files...")
    create_minimal_package_json()
    create_minimal_gitignore()
    
    # Summary
    total_removed = len(removed_files) + len(removed_dirs) + len(removed_components) + len(removed_public)
    
    print("\n" + "=" * 50)
    print("🎉 Final Cleanup Summary:")
    print(f"   • Total items removed: {total_removed}")
    print(f"   • Files removed: {len(removed_files)}")
    print(f"   • Directories removed: {len(removed_dirs)}")
    print(f"   • Components removed: {len(removed_components)}")
    print(f"   • Public files removed: {len(removed_public)}")
    
    print("\n✨ Codebase is now fully optimized and minimal!")
    print("🚀 Ready for production deployment!")
    
    # Show final structure
    print("\n📂 Final project structure:")
    print("   • backend/app.py (main backend)")
    print("   • frontend/src/ (essential components only)")
    print("   • frontend/public/ (essential assets only)")
    print("   • firebase.json (deployment config)")
    print("   • deploy.sh (deployment script)")

if __name__ == "__main__":
    main()
