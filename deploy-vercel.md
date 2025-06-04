# 🚀 PitchGuard Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

1. **Visit Vercel Dashboard**: Go to [vercel.com](https://vercel.com) and sign in
2. **Import Project**: Click "New Project" → "Import Git Repository"
3. **Connect GitHub**: Select the `Sagexd08/PitchGuard` repository
4. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables** (Optional):
   ```
   VITE_API_URL=https://your-backend-api.com
   VITE_REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

6. **Deploy**: Click "Deploy" and wait for the build to complete

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? pitchguard-lite
# - Directory? ./frontend
# - Override settings? No

# For production deployment
vercel --prod
```

## 🔧 Build Configuration

The project includes a `vercel.json` configuration file that automatically:

- Sets the correct build directory (`frontend/dist`)
- Configures SPA routing with rewrites
- Optimizes caching for static assets
- Sets up proper build commands

## 🌐 Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## 🔒 Environment Variables

Set these in your Vercel dashboard under "Settings" → "Environment Variables":

```env
# Clerk Authentication
VITE_REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Backend API URL
VITE_API_URL=https://your-backend-api.com

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

## 📊 Deployment Status

After deployment, your app will be available at:
- **Preview URL**: `https://pitchguard-lite-xxx.vercel.app`
- **Production URL**: `https://your-domain.com` (if custom domain configured)

## 🛠️ Troubleshooting

### Build Fails
- Check that all dependencies are in `frontend/package.json`
- Ensure TypeScript types are correct
- Verify environment variables are set

### Routing Issues
- The `vercel.json` includes SPA rewrites
- All routes should redirect to `/index.html`

### Performance
- Static assets are cached for 1 year
- Gzip compression is enabled
- Build artifacts are optimized

## 🔄 Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

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

Your PitchGuard application is now live on Vercel with:
- ⚡ Lightning-fast global CDN
- 🔄 Automatic deployments from GitHub
- 📊 Built-in analytics
- 🛡️ DDoS protection
- 🌍 Edge functions support
