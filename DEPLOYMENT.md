# 🚀 Vercel Deployment Guide

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Vercel Dashboard (Recommended)**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `school-stock-management` repository
5. Vercel will auto-detect settings from `vercel.json`
6. Click "Deploy"

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
- Add your Firebase configuration if needed
- Set `NODE_ENV=production`

## Your App URLs
- **Production:** `https://school-stock-management.vercel.app`
- **Preview:** Auto-generated for each commit

## Automatic Deployments
✅ Every push to `main` branch = Production deployment
✅ Every pull request = Preview deployment

## Troubleshooting
- Build fails? Check `vercel.json` configuration
- 404 errors? Rewrites are configured for React Router
- Slow builds? Using `npm ci` for faster installs

## Files Configured for Vercel
- ✅ `vercel.json` - Deployment settings
- ✅ `package.json` - No conflicting homepage
- ✅ `.gitignore` - Proper exclusions