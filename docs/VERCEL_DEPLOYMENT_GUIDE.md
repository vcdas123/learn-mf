# Vercel Deployment Guide

This guide explains how to deploy the Micro-Frontend Demo to Vercel.

## 🚀 Overview

To deploy this architecture, you need to create **4 separate projects** on Vercel:
1. **Host Application**
2. **Student Grades Remote**
3. **Activity Log Remote**
4. **Image Analyzer Remote**

## 1. Deploy the Remotes First

You must deploy the remotes first to get their production URLs.

### For each Remote (`remotes/*`):
1. **Import** the repository into Vercel.
2. **Root Directory**: Select the specific remote folder (e.g., `remotes/student-grades`).
3. **Framework Preset**: Select `Other`.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`
7. **Deploy**.

### CORS Configuration
Each remote contains a `vercel.json` file that automatically enables CORS:
```json
{
  "version": 2,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```
This is **critical** for the Host to be able to fetch the `remoteEntry.js` and chunks from the remote origins.

## 2. Deploy the Host Application

Once you have the URLs for all three remotes, you can deploy the Host.

### Configuration:
1. **Import** the repository into Vercel.
2. **Root Directory**: `host`
3. **Framework Preset**: `Other`.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Environment Variables:
Before clicking deploy, add the following **Environment Variables** in the Vercel dashboard:

| Key | Value |
| :--- | :--- |
| `REMOTE_STUDENT_GRADES_URL` | `https://your-student-grades-url.vercel.app` |
| `REMOTE_ACTIVITY_LOG_URL` | `https://your-activity-log-url.vercel.app` |
| `REMOTE_IMAGE_ANALYZER_URL` | `https://your-image-analyzer-url.vercel.app` |

*Note: Do NOT include a trailing slash in the URLs.*

## 3. Handling Deep Links (SPA Routing)

The `vercel.json` files in both the host and remotes include a rewrite rule to handle client-side routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This ensures that refreshing the page on a nested route (like `/activity-log/123`) correctly loads the application.

## 📋 Troubleshooting

### "Script Error" or "Failed to fetch"
- Check that the remote URLs in the Host's environment variables match the actual deployed URLs.
- Ensure the remote URLs in environment variables **do not** have a trailing slash.
- Verify that the `remoteEntry.js` is accessible at `https://your-remote-url.vercel.app/remoteEntry.js`.

### Deployment Order
If you update a remote, Vercel will redeploy it. The Host will automatically pick up the new version on the next page reload because it fetches the remote build at runtime. You only need to redeploy the Host if you change the remote URLs or the Host's own code.
