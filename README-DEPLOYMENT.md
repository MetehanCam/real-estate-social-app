# 🚀 Deployment Guide for Real Estate Microblog

## Overview
This app consists of two parts:
- **Frontend**: React app (can be deployed to Vercel)
- **Backend**: Node.js/Express API (needs separate hosting)

## 📋 Deployment Steps

### Step 1: Deploy Backend First
Since Vercel doesn't support Node.js backends directly, deploy your backend to one of these services:

#### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `PORT`: 5000 (or Railway will set automatically)

#### Option B: Render
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables

#### Option C: Heroku
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGODB_URI=...`
4. Deploy: `git push heroku main`

### Step 2: Update Frontend Configuration
1. Copy `.env.example` to `.env.local`
2. Update `VITE_API_BASE_URL` with your backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

### Step 3: Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect it's a Vite project
4. Add environment variable in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your backend API URL
5. Deploy!

## 🔧 Important Files Created
- `vercel.json`: Handles React Router routing
- `.env.example`: Template for environment variables
- Updated `api.js`: Uses environment variables

## 🌐 Environment Variables Needed

### Frontend (Vercel)
- `VITE_API_BASE_URL`: Your backend API URL

### Backend (Railway/Render/Heroku)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (usually auto-set by hosting service)

## ✅ Testing Deployment
1. Visit your Vercel URL
2. Try registering a new user
3. Test login/logout functionality
4. Create and interact with posts

## 🔒 Security Notes
- Make sure to use HTTPS URLs in production
- Keep your JWT_SECRET secure
- Use a production MongoDB database (not local)