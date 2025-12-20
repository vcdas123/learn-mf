import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/**
 * DEVELOPMENT-ONLY ENTRY POINT FOR REMOTE APPLICATION
 * 
 * CRITICAL ARCHITECTURE RULES:
 * 1. This file is DEV-ONLY and MUST NOT be imported by host
 * 2. Creates createRoot() ONLY for standalone development
 * 3. Creates BrowserRouter ONLY for standalone development
 * 4. Uses the same App component that host uses
 * 5. This file is NOT exposed via Module Federation
 * 
 * USAGE:
 * - Used when running remote in standalone mode (npm run dev)
 * - NOT used when remote is loaded by host
 * - Entry point: webpack dev server points to this file
 */

// Get container element from index.html
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container element not found in index.html");
}

// Create React root (DEV-ONLY)
const root = createRoot(container);

// Render with BrowserRouter (DEV-ONLY)
// In production, host provides BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* BrowserRouter is DEV-ONLY - host provides it in production */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/**
 * Webpack Configuration for Dev Entry:
 * 
 * // webpack.config.js (dev mode)
 * entry: {
 *   dev: './src/dev.tsx',  // Dev-only entry
 * },
 * 
 * // webpack.config.js (production)
 * entry: {
 *   // No dev entry - only App is exposed
 * },
 * 
 * Module Federation exposes:
 * - './App': './src/App.tsx' (production component)
 * - NOT './dev' (dev entry is not exposed)
 */

