/**
 * ENTERPRISE MODULE FEDERATION CONFIGURATION
 *
 * This file shows the webpack Module Federation configuration
 * for both host and remote applications.
 *
 * IMPORTANT: The paths in "exposes" (e.g., "./src/App.tsx") refer to
 * actual files in your remote application, NOT the template files
 * in this research folder.
 *
 * Template files:
 * - RemoteApp.enterprise.tsx → Template for what your src/App.tsx should contain
 * - RemoteDevEntry.enterprise.tsx → Template for what your src/dev.tsx should contain
 */

// ============================================
// HOST APPLICATION CONFIGURATION
// ============================================

const hostConfig = {
  name: "host",
  remotes: {
    // Remote applications are imported as components
    grade: "grade@http://localhost:3105/remoteEntry.js",
    dynamiclogsheet: "dynamiclogsheet@http://localhost:3106/remoteEntry.js",
    "ai-vision": "ai-vision@http://localhost:3107/remoteEntry.js",
  },
  shared: {
    // CRITICAL: All React dependencies MUST be singletons
    react: {
      singleton: true,
      requiredVersion: "^18.0.0",
      eager: false,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: "^18.0.0",
      eager: false,
    },
    "react-router-dom": {
      singleton: true,
      requiredVersion: "^6.0.0",
      eager: false,
    },
    "react-redux": {
      singleton: true,
      requiredVersion: "^8.0.0",
      eager: false,
    },
  },
};

// ============================================
// REMOTE APPLICATION CONFIGURATION
// ============================================

const remoteConfig = {
  name: "grade", // Change per remote: 'grade', 'dynamiclogsheet', 'ai-vision'
  filename: "remoteEntry.js",
  exposes: {
    // CRITICAL: Expose App component, NOT mount function, NOT dev entry
    // This points to the actual App.tsx file in your remote application
    // (See RemoteApp.enterprise.tsx as a template for what this file should contain)
    "./App": "./src/App.tsx", // Pure React component (actual file in remote app)
    // DO NOT expose:
    // - "./mount": "./src/mount.tsx" ❌
    // - "./dev": "./src/dev.tsx" ❌
  },
  shared: {
    // CRITICAL: Same singleton configuration as host
    react: {
      singleton: true,
      requiredVersion: "^18.0.0",
      eager: false,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: "^18.0.0",
      eager: false,
    },
    "react-router-dom": {
      singleton: true,
      requiredVersion: "^6.0.0",
      eager: false,
    },
    "react-redux": {
      singleton: true,
      requiredVersion: "^8.0.0",
      eager: false,
    },
  },
};

// ============================================
// WEBPACK CONFIGURATION EXAMPLE
// ============================================

// Host webpack.config.js
const hostWebpackConfig = {
  // ... other webpack config
  plugins: [
    new ModuleFederationPlugin(hostConfig),
    // ... other plugins
  ],
  entry: {
    // Host entry point
    main: "./src/index.tsx", // Contains createRoot() and BrowserRouter
  },
};

// Remote webpack.config.js (development)
const remoteWebpackConfigDev = {
  // ... other webpack config
  plugins: [
    new ModuleFederationPlugin(remoteConfig),
    // ... other plugins
  ],
  entry: {
    // Dev-only entry for standalone development
    dev: "./src/dev.tsx", // Contains createRoot() and BrowserRouter
    // App is NOT an entry - it's exposed via Module Federation
  },
};

// Remote webpack.config.js (production)
const remoteWebpackConfigProd = {
  // ... other webpack config
  plugins: [
    new ModuleFederationPlugin(remoteConfig),
    // ... other plugins
  ],
  entry: {
    // Production has no entry - App is exposed via Module Federation
    // Dev entry is NOT included in production build
  },
};

module.exports = {
  hostConfig,
  remoteConfig,
  hostWebpackConfig,
  remoteWebpackConfigDev,
  remoteWebpackConfigProd,
};
