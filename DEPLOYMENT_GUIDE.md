# 🚀 Stealth Score Deployment Guide

## 📋 Prerequisites

### Required
- **Node.js** 18+ and npm
- **Git** for version control
- **OpenRouter API Key** (get from [openrouter.ai](https://openrouter.ai))

### Optional
- **Clerk Account** for authentication (get from [clerk.com](https://clerk.com))
- **WalletConnect Project ID** for Web3 features

## 🔧 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Sagexd08/PitchGuard.git
cd PitchGuard
```

### 2. Environment Configuration
```bash
# Copy environment template
cp frontend/.env.example frontend/.env.local

# Edit with your API keys
nano frontend/.env.local
```

**Required Environment Variables:**
```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Install Dependencies
```bash
cd frontend
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🌐 Vercel Deployment (Recommended)

### Method 1: Automatic GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: Complete OnlyFounders AI hackathon submission"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import `Sagexd08/PitchGuard` repository
   - Configure settings:
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Environment Variables:**
   Add in Vercel dashboard:
   ```
   VITE_OPENROUTER_API_KEY=your_key_here
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key (optional)
   ```

4. **Deploy!** 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🐳 Docker Deployment

### Build and Run
```bash
# Build frontend
cd frontend
docker build -t pitchguard-frontend .

# Run container
docker run -p 3000:3000 pitchguard-frontend
```

### Docker Compose (Full Stack)
```bash
# Run both frontend and backend
docker-compose up -d
```

## 📦 Manual Build

### Production Build
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` directory.

### Serve Static Files
```bash
# Using Python
cd frontend/dist
python -m http.server 3000

# Using Node.js serve
npx serve -s dist -l 3000
```

## 🔍 Deployment Validation

### Automated Check
```bash
python deploy-hackathon.py
```

### Manual Verification
1. ✅ All dependencies installed
2. ✅ Environment variables set
3. ✅ Build completes successfully
4. ✅ All routes accessible
5. ✅ MetaMask integration works
6. ✅ API endpoints respond

## 🌍 Production URLs

- **Frontend:** https://pitchguard.vercel.app
- **Repository:** https://github.com/Sagexd08/PitchGuard
- **Documentation:** https://github.com/Sagexd08/PitchGuard/blob/main/README.md

## 🔧 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Working:**
- Ensure variables start with `VITE_`
- Restart development server after changes
- Check Vercel dashboard for production

**MetaMask Not Detected:**
- Ensure HTTPS in production
- Check browser console for errors
- Verify Web3 dependencies installed

**API Errors:**
- Verify OpenRouter API key is valid
- Check network connectivity
- Ensure CORS is configured

### Performance Optimization

**Bundle Size:**
```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist
```

**Caching:**
- Static assets cached for 1 year
- HTML files not cached
- Service worker for offline support

## 📊 Monitoring

### Analytics
- Built-in error tracking
- Performance monitoring
- User interaction analytics

### Health Checks
- `/health` endpoint for status
- Automated deployment checks
- Real-time error alerts

## 🔐 Security

### Production Security
- HTTPS enforced
- CSP headers configured
- XSS protection enabled
- Secure cookie settings

### API Security
- Rate limiting implemented
- Input validation
- Encryption at rest
- Secure key management

## 🎯 OnlyFounders Hackathon Specific

### Submission Checklist
- ✅ Live demo URL
- ✅ GitHub repository
- ✅ README documentation
- ✅ Video demonstration
- ✅ Technical architecture
- ✅ Privacy features working
- ✅ Web3 integration active

### Key Features to Highlight
1. **Privacy-First:** TEE + ZK Proofs + Federated Learning
2. **Web3 Native:** DID + Trust Graph + MetaMask
3. **Advanced UX:** GSAP + Framer Motion animations
4. **Production Ready:** Full deployment pipeline

---

**🛡️ PitchGuard - Where Privacy Meets Innovation**

For support: [GitHub Issues](https://github.com/Sagexd08/PitchGuard/issues)
