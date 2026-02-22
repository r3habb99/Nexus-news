# Nexus News - Environment Configuration

## Overview
This project uses environment variables to manage different configurations for development and production environments.

## Environment Files

- **`.env.development`** - Used when running `npm run dev` (local development)
- **`.env.production`** - Used when running `npm run build` (production build for Vercel)
- **`.env.example`** - Template file showing required variables

## Available Environment Variables

### `VITE_API_BASE_URL`
The base URL for your backend API.

- **Development**: `http://localhost:3000/api/news`
- **Production**: Your Vercel backend URL (e.g., `https://your-backend-api.vercel.app/api/news`)

## How It Works

1. **Local Development**:
   - Run `npm run dev`
   - Vite automatically loads `.env.development`
   - API calls go to `http://localhost:3000/api/news`

2. **Production Build**:
   - Run `npm run build`
   - Vite automatically loads `.env.production`
   - API calls go to your production backend URL

3. **Vercel Deployment**:
   - Vercel automatically uses `.env.production` during build
   - Alternatively, set environment variables in Vercel dashboard

## Setting Up Vercel Environment Variables

### Option 1: Using .env.production (Recommended)
Update `.env.production` with your actual backend URL:
```
VITE_API_BASE_URL=https://your-backend-api.vercel.app/api/news
```

### Option 2: Using Vercel Dashboard
1. Go to your project settings on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-api.vercel.app/api/news`
   - **Environment**: Production

## Local Development Setup

1. Ensure `.env.development` exists with:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api/news
   ```

2. Start your backend server on port 3000

3. Run the development server:
   ```bash
   npm run dev
   ```

## Important Notes

- ⚠️ **Never commit** `.env.development` or `.env.production` files if they contain sensitive data
- ✅ **Always use** the `VITE_` prefix for environment variables in Vite projects
- 🔄 Variables are **embedded at build time**, not runtime
- 🔁 Restart the dev server after changing environment variables

## Troubleshooting

If environment variables aren't working:
1. Check the variable name has the `VITE_` prefix
2. Restart the development server
3. Clear the browser cache
4. Check the file is in the project root
5. Verify there are no syntax errors in the .env file
