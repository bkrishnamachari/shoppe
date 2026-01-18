# Shoppe

A simple, elegant shared shopping list app. Add items, check them off, and share the list with others. Works great on mobile and can be installed as a PWA (Progressive Web App).

## Features

- Add and check off shopping list items
- Shared list - anyone with the link sees the same items
- Clean, minimal design
- Installable as a mobile app (PWA)
- Data persists via Vercel KV storage

## Tech Stack

- Vanilla JavaScript frontend
- Vercel Serverless Functions (API)
- Vercel KV (Redis-based storage)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended) - this includes `npx`
- A [Vercel](https://vercel.com/) account
- A [GitHub](https://github.com/) account (optional, for connecting repo to Vercel)

## Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com/) and sign in
3. Click "Add New Project" and import your GitHub repository
4. Vercel will auto-detect the settings - click "Deploy"
5. Set up Vercel KV (see below)

### Option 2: Deploy via CLI

1. Install the Vercel CLI (if not already available):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to production:
   ```bash
   npx vercel --prod
   ```

   On first run, you'll be prompted to link the project to your Vercel account.

## Setting Up Vercel KV

The app requires Vercel KV for data storage. After deploying:

1. Go to your project dashboard on [vercel.com](https://vercel.com/)
2. Navigate to the "Storage" tab
3. Click "Create Database" and select "KV"
4. Follow the prompts to create a KV store and connect it to your project
5. Redeploy the app after connecting KV:
   ```bash
   npx vercel --prod
   ```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Link to your Vercel project (required for KV access):
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   This runs `vercel dev` which starts a local server with access to your Vercel KV store.

## Project Structure

```
shoppe/
├── api/
│   └── items.js      # Serverless API for CRUD operations
├── public/
│   ├── index.html    # Main HTML page
│   ├── style.css     # Styles
│   ├── app.js        # Frontend JavaScript
│   ├── manifest.json # PWA manifest
│   └── icon-*.png    # App icons
├── package.json
└── vercel.json       # Vercel configuration
```
