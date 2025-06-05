# 🚀 PitchGuard Firebase Deployment Guide

## Prerequisites

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

## Quick Deploy to Firebase

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `pitchguard-app`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Initialize Firebase (if needed)

```bash
# Initialize Firebase in your project directory
firebase init hosting

# Select options:
# - Use an existing project: pitchguard-app
# - Public directory: frontend/dist
# - Configure as SPA: Yes
# - Set up automatic builds: No
# - Overwrite index.html: No
```

### Step 3: Build and Deploy

```bash
# Build the frontend
cd frontend
npm run build
cd ..

# Deploy to Firebase
firebase deploy
```

## 🔧 Configuration Details

### Firebase Configuration (`firebase.json`)
- **Public Directory**: `frontend/dist`
- **SPA Rewrites**: All routes redirect to `/index.html`
- **Security Headers**: Content security, XSS protection, frame options
- **Caching**: Static assets cached for 1 year

### Project Configuration (`.firebaserc`)
- **Default Project**: `pitchguard-app`

## 🌐 Environment Variables

Update your environment variables for Firebase hosting:

```env
# Frontend Environment (.env)
VITE_API_URL=https://your-backend-api.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 📊 Deployment Commands

### Development Deploy
```bash
# Build and deploy
npm run build:frontend
firebase deploy
```

### Production Deploy
```bash
# Build optimized version
cd frontend
npm run build
cd ..

# Deploy to production
firebase deploy --only hosting
```

## 🛠️ Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `cd frontend && npm install`
- Check TypeScript compilation: `cd frontend && npm run build`
- Verify environment variables are set

### Deployment Issues
- Check Firebase project exists: `firebase projects:list`
- Verify authentication: `firebase login:list`
- Check build output exists: `ls frontend/dist`

### Routing Issues
- Firebase automatically handles SPA routing
- All routes redirect to `/index.html`
- Client-side routing handled by React Router

## 🔄 Automatic Deployments

### GitHub Actions (Optional)
Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend && npm install
      
      - name: Build
        run: cd frontend && npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: pitchguard-app
```

## 📱 Features Included

✅ **React 18** with TypeScript  
✅ **Vite** for fast builds  
✅ **Tailwind CSS** for styling  
✅ **Framer Motion** for animations  
✅ **Clerk** for authentication  
✅ **Advanced UI Components**  
✅ **Export/Share functionality**  
✅ **Security & Settings pages**  
✅ **Responsive design**  

## 🎉 Success!

Your PitchGuard application is now live on Firebase with:
- ⚡ Global CDN delivery
- 🔒 SSL certificate included
- 📊 Built-in analytics
- 🛡️ DDoS protection
- 🌍 Custom domain support

## 📍 Live URLs

After deployment, your app will be available at:
- **Firebase URL**: `https://pitchguard-app.web.app`
- **Custom Domain**: `https://pitchguard-app.firebaseapp.com`

## 🔧 Managing Your App

- **Firebase Console**: https://console.firebase.google.com/project/pitchguard-app
- **Hosting Dashboard**: View deployment history and analytics
- **Custom Domains**: Add your own domain in hosting settings
