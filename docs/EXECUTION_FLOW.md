[⬅️ Back to Master Index](../README.md)\n\n# Remote Application Execution Flows

## Overview

Remote applications can run in **two modes**:

1. **Standalone Mode**: Remote runs independently on its own port (e.g., `http://localhost:3106`)
2. **Host Mode**: Remote is loaded by the host application via Module Federation (e.g., `http://localhost:3000/activity-log`)

This document explains the step-by-step execution flow for both modes and the webpack configurations that make this possible.

---

## 🔧 Key Webpack Configuration Settings

### Remote Webpack Config (`remotes/*/webpack.config.js`)

```javascript
{
  // 1. ENTRY POINT - Determines standalone vs host mode
  entry: "./src/dev.tsx",  // Always uses dev.tsx for standalone mode
  
  // 2. MODULE FEDERATION PLUGIN - Enables host to load remote
  plugins: [
    new ModuleFederationPlugin({
      name: "activity-log",              // Remote name
      filename: "remoteEntry.js",        // Entry file host loads
      exposes: {
        "./App": "./src/App.tsx"         // Exposes App.tsx (NOT dev.tsx!)
      },
      shared: { /* shared dependencies */ }
    })
  ],
  
  // 3. DEV SERVER - Enables standalone access
  devServer: {
    port: 3106,                          // Standalone port
    headers: {
      "Access-Control-Allow-Origin": "*" // CORS for host access
    }
  },
  
  // 4. OUTPUT - Generates remoteEntry.js
  output: {
    publicPath: "auto"                   // Auto-detects public path
  }
}
```

### Host Webpack Config (`host/webpack.config.js`)

```javascript
{
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        // Maps module name to remoteEntry.js URL
        "activity-log": "activity_log@http://localhost:3106/remoteEntry.js",
        "student-grades": "student_grades@http://localhost:3105/remoteEntry.js",
        "image-analyzer": "image_analyzer@http://localhost:3107/remoteEntry.js"
      },
      shared: { /* shared dependencies */ }
    })
  ]
}
```

---

## 📋 Flow 1: Standalone Mode (Remote on Own Port)

### When This Happens
- User navigates directly to `http://localhost:3106`
- Remote is developed/tested independently
- Remote needs its own React root, router, and Redux provider

### Step-by-Step Execution Flow

#### Step 1: Webpack Entry Point
```
User visits: http://localhost:3106
↓
Webpack dev server starts
↓
Entry point: ./src/dev.tsx (from webpack.config.js)
```

#### Step 2: dev.tsx Execution
```typescript
// remotes/activity-log/src/dev.tsx

1. Import React and createRoot
2. Import BrowserRouter (creates its own router)
3. Import Provider from react-redux
4. Import standaloneStore (mock Redux store)
5. Import App component (the actual remote app)
```

#### Step 3: Create React Root
```typescript
const container = document.getElementById("root");
const root = createRoot(container);
```

#### Step 4: Render Standalone App Structure
```typescript
root.render(
  <React.StrictMode>
    <Provider store={standaloneStore}>        // Mock Redux store
      <ThemeProvider theme={theme}>           // MUI theme
        <CssBaseline />
        <BrowserRouter>                       // Own router instance
          <Alert>Standalone Mode</Alert>      // Warning banner
          <App />                             // Remote app component
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
```

#### Step 5: App.tsx Execution
```typescript
// remotes/activity-log/src/App.tsx

1. Uses Routes (inherits BrowserRouter from dev.tsx)
2. Uses relative paths (/, /list, /:id)
3. Uses useReduxStore hooks (works with standaloneStore)
4. Renders pages (List, Detail, etc.)
```

#### Step 6: Component Tree (Standalone)
```
<React.StrictMode>
  └─ <Provider store={standaloneStore}>
      └─ <ThemeProvider>
          └─ <BrowserRouter>              ← Own router
              └─ <App>
                  └─ <Routes>
                      └─ <Route path="/" element={<List />} />
                      └─ <Route path="/:id" element={<Detail />} />
```

### Key Points for Standalone Mode

✅ **Entry Point**: `dev.tsx` (creates full React app)  
✅ **Router**: Own `BrowserRouter` instance  
✅ **Redux**: Uses `standaloneStore` (mock store)  
✅ **URL**: `http://localhost:3106` (direct access)  
✅ **Module Federation**: Still generates `remoteEntry.js` (for host mode)

---

## 📋 Flow 2: Host Mode (Remote Loaded by Host)

### When This Happens
- User navigates to `http://localhost:3000/activity-log`
- Host application loads remote via Module Federation
- Remote runs inside host's React tree

### Step-by-Step Execution Flow

#### Step 1: Host Application Starts
```
User visits: http://localhost:3000/activity-log
↓
Host webpack dev server running on port 3000
↓
Host entry: ./src/index.tsx
```

#### Step 2: Host Creates React Root
```typescript
// host/src/index.tsx

const root = createRoot(container);
root.render(
  <Provider store={store}>              // Host Redux store
    <BrowserRouter>                     // Host router
      <App />                           // Host app
    </BrowserRouter>
  </Provider>
);
```

#### Step 3: Host App.tsx Routes
```typescript
// host/src/App.tsx

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/activity-log/*" element={
    <RemoteErrorBoundary>
      <Suspense fallback={<RemoteLoading />}>
        <ActivityLogRemote />          // Lazy-loaded remote
      </Suspense>
    </RemoteErrorBoundary>
  } />
</Routes>
```

#### Step 4: Lazy Load Remote Component
```typescript
// host/src/routes/lazyRemotes.tsx

export const ActivityLogRemote = lazy(() =>
  retryRemoteLoad(() => {
    // Module Federation dynamic import
    return import("activity-log/App");  // ← Loads from remoteEntry.js
  })
);
```

#### Step 5: Module Federation Resolution
```
Browser requests: http://localhost:3106/remoteEntry.js
↓
Webpack ModuleFederationPlugin intercepts
↓
Loads remoteEntry.js from remote server
↓
Resolves "activity-log/App" to ./src/App.tsx
```

#### Step 6: Remote App.tsx Loaded (NOT dev.tsx!)
```typescript
// remotes/activity-log/src/App.tsx

// This is what gets loaded by host (NOT dev.tsx!)
function ActivityLogApp() {
  return (
    <Container>
      <Routes>                          // Uses host's BrowserRouter context
        <Route path="/" element={<List />} />
        <Route path="/:id" element={<Detail />} />
      </Routes>
    </Container>
  );
}
```

#### Step 7: Component Tree (Host Mode)
```
<React.StrictMode> (host)
  └─ <Provider store={hostStore}>      ← Host Redux store
      └─ <BrowserRouter>                ← Host router
          └─ <App> (host)
              └─ <Routes>
                  └─ <Route path="/activity-log/*">
                      └─ <RemoteErrorBoundary>
                          └─ <Suspense>
                              └─ <ActivityLogRemote> (lazy loaded)
                                  └─ <ActivityLogApp> (from remote)
                                      └─ <Routes> (relative paths)
                                          └─ <Route path="/" element={<List />} />
```

### Key Points for Host Mode

✅ **Entry Point**: `App.tsx` (exposed via Module Federation)  
✅ **Router**: Inherits host's `BrowserRouter` context  
✅ **Redux**: Uses host's Redux store (via Provider context)  
✅ **URL**: `http://localhost:3000/activity-log` (via host)  
✅ **Module Federation**: Loads `remoteEntry.js` from remote server

---

## 🔑 Critical Differences

| Aspect | Standalone Mode | Host Mode |
|--------|----------------|-----------|
| **Entry Point** | `dev.tsx` | `App.tsx` |
| **React Root** | Creates own root | Uses host's root |
| **BrowserRouter** | Own instance | Inherits from host |
| **Redux Store** | `standaloneStore` (mock) | Host store (real) |
| **URL** | `localhost:3106` | `localhost:3000/activity-log` |
| **Module Federation** | Generates `remoteEntry.js` | Loads via `remoteEntry.js` |
| **Routing** | Absolute paths work | Relative paths only |
| **Context** | Full control | Inherits host context |

---

## 🎯 How Module Federation Makes This Work

### 1. Remote Exposes App.tsx
```javascript
// webpack.module-federation.js
exposes: {
  "./App": "./src/App.tsx"  // Exposes App.tsx, NOT dev.tsx
}
```

**Why?** Because `dev.tsx` creates its own React root, which would conflict with host's root.

### 2. Host Loads Remote
```javascript
// host/webpack.config.js
remotes: {
  "activity-log": "activity_log@http://localhost:3106/remoteEntry.js",
  "student-grades": "student_grades@http://localhost:3105/remoteEntry.js",
  "image-analyzer": "image_analyzer@http://localhost:3107/remoteEntry.js"
}
```

**How?** When host does `import("activity-log/App")`, webpack:
1. Looks up "activity-log" in remotes config
2. Fetches `remoteEntry.js` from `http://localhost:3106`
3. Resolves `./App` to the exposed `App.tsx`
4. Returns the component

### 3. Shared Dependencies
```javascript
shared: {
  react: { singleton: true, eager: true },
  "react-router-dom": { singleton: true, eager: true },
  "react-redux": { singleton: true, eager: true }
}
```

**Why?** Ensures host and remote use the same React instance, router context, and Redux store.

---

## 🔄 Complete Execution Comparison

### Standalone Mode Flow
```
1. User → http://localhost:3106
2. Webpack dev server → entry: dev.tsx
3. dev.tsx → createRoot() + BrowserRouter + Provider(standaloneStore)
4. dev.tsx → renders <App />
5. App.tsx → Routes with relative paths
6. Pages render → useReduxStore hooks work with standaloneStore
```

### Host Mode Flow
```
1. User → http://localhost:3000/activity-log
2. Host webpack → entry: index.tsx
3. index.tsx → createRoot() + BrowserRouter + Provider(hostStore)
4. App.tsx → Routes, matches /activity-log/*
5. lazyRemotes.tsx → import("activity-log/App")
6. Module Federation → fetches remoteEntry.js from localhost:3106
7. remoteEntry.js → resolves to App.tsx
8. App.tsx → Routes with relative paths (inherits host router)
9. Pages render → useReduxStore hooks work with hostStore
```

---

## 🛠️ Webpack Configuration Breakdown

### Remote Config (`remotes/activity-log/webpack.config.js`)

```javascript
module.exports = (env, argv) => {
  const PORT = process.env.REMOTE_ACTIVITY_LOG_PORT || 3106;
  
  return {
    // 1. Entry: Always dev.tsx for standalone mode
    entry: "./src/dev.tsx",
    
    // 2. Dev Server: Enables standalone access
    devServer: {
      port: Number(PORT),              // Standalone port
      headers: {
        "Access-Control-Allow-Origin": "*"  // CORS for host
      }
    },
    
    // 3. Module Federation: Exposes App.tsx for host
    plugins: [
      new ModuleFederationPlugin({
        name: "activity-log",
        filename: "remoteEntry.js",      // Host loads this
        exposes: {
          "./App": "./src/App.tsx"      // Exposes App.tsx
        },
        shared: { /* ... */ }
      })
    ],
    
    // 4. Output: Generates remoteEntry.js
    output: {
      publicPath: "auto"               // Auto public path
    }
  };
};
```

### Host Config (`host/webpack.config.js`)

```javascript
module.exports = (env, argv) => {
  return {
    entry: "./src/index.tsx",
    
    plugins: [
      new ModuleFederationPlugin({
        name: "host",
        remotes: {
          // Maps module name to remoteEntry.js URL
          "activity-log": "activity_log@http://localhost:3106/remoteEntry.js",
          "student-grades": "student_grades@http://localhost:3105/remoteEntry.js",
          "image-analyzer": "image_analyzer@http://localhost:3107/remoteEntry.js"
        },
        shared: { /* ... */ }
      })
    ]
  };
};
```

---

## 🎓 Key Takeaways

1. **Two Entry Points**:
   - `dev.tsx`: Standalone mode (creates full app)
   - `App.tsx`: Host mode (pure component)

2. **Module Federation Exposes App.tsx**:
   - Host loads `App.tsx`, not `dev.tsx`
   - `dev.tsx` is only for standalone development

3. **Context Inheritance**:
   - Host mode: Remote inherits BrowserRouter and Redux Provider
   - Standalone mode: Remote creates its own context

4. **Shared Dependencies**:
   - Same React instance ensures context works
   - Singleton mode prevents duplicate instances

5. **CORS Headers**:
   - Remote dev server needs CORS headers
   - Allows host to fetch `remoteEntry.js`

6. **Public Path**:
   - `publicPath: "auto"` ensures correct asset URLs
   - Works for both standalone and host modes

---

## 🚀 Production Builds

### Standalone Production
```bash
npm run build:activity-log
# Generates:
# - dist/main.[hash].js (dev.tsx bundle)
# - dist/remoteEntry.js (Module Federation entry)
# - dist/index.html (standalone HTML)
```

### Host Production
```bash
npm run build:host
# Generates:
# - dist/main.[hash].js (host bundle)
# - References remoteEntry.js from remote servers
```

**Note**: In production, remotes can still run standalone by serving their `dist/` folder, while host loads them via Module Federation.

---

This dual-mode architecture allows remotes to be developed independently while seamlessly integrating with the host application.
