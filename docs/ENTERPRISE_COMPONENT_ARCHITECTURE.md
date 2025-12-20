# Enterprise Component-Based Micro-Frontend Architecture

## 🎯 Core Principle

**ONE React root, ONE BrowserRouter, remotes as pure React components**

This architecture ensures React context flows naturally through a single component tree, eliminating the need for manual context passing or multiple React roots.

---

## 📌 CRITICAL ARCHITECTURE RULES

### ✅ MUST DO (Production)

1. **EXACTLY ONE `createRoot()` call**
   - ✅ MUST exist ONLY in the host application
   - ✅ MUST be called once at application startup
   - ✅ Remote applications MUST NOT call `createRoot()` or `ReactDOM.render()` in production code

2. **EXACTLY ONE `BrowserRouter`**
   - ✅ MUST be created in the host application
   - ✅ Remote applications MUST NOT create `BrowserRouter`, `HashRouter`, `MemoryRouter`, or any router provider in production code

3. **Remote applications as pure React components**
   - ✅ MUST export a React component (e.g., `App` or `RemoteApp`)
   - ✅ MUST be default export for Module Federation
   - ✅ MUST NOT expose a `mount(container)` function
   - ✅ MUST NOT manage their own DOM mounting lifecycle
   - ✅ MUST NOT touch DOM or document

4. **React context inheritance**
   - ✅ Context flows naturally through React component tree
   - ✅ Remote components inherit router context from host automatically
   - ✅ Remote components inherit Redux store from host automatically
   - ✅ DO NOT pass router context manually

5. **Routing model**
   - ✅ Host owns all top-level routes
   - ✅ Remote applications own ONLY nested routes under a base path
   - ✅ Remote routes use relative paths (no leading '/')

6. **Shared dependencies**
   - ✅ `react`, `react-dom`, `react-router-dom` MUST be shared as singletons
   - ✅ Module Federation configured with singleton shared dependencies

7. **Remote routing**
   - ✅ MUST use `<Routes>` and `<Route>` only
   - ✅ MUST NOT use `BrowserRouter` inside remotes
   - ✅ MUST use relative paths (no leading '/')

8. **Navigation in remotes**
   - ✅ MUST use `useNavigate()`, `useParams()`, `useLocation()` hooks
   - ✅ Hooks work automatically because remotes are children of host's `BrowserRouter`

### ✅ ALLOWED (Development Only)

9. **Standalone remote development**
   - ✅ Remote applications MAY run standalone in DEVELOPMENT ONLY
   - ✅ Standalone mode MUST use a DEV-ONLY entry file (e.g., `dev.tsx`)
   - ✅ Dev-only entry MAY create `createRoot()` and `BrowserRouter`
   - ✅ Dev-only entry MUST NOT be imported by the host
   - ✅ Dev-only entry MUST NOT be exposed via Module Federation

10. **Entry-point separation**
    - ✅ `App.tsx` → pure component (used by host + dev)
    - ✅ `dev.tsx` → dev-only root + BrowserRouter
    - ✅ Production code MUST NOT depend on standalone logic

### ❌ ABSOLUTELY FORBIDDEN

1. ❌ **Multiple React roots in production**
   - ❌ `createRoot()` in remote production code
   - ❌ `ReactDOM.render()` in remote production code
   - ❌ Any DOM mounting logic in remote production code

2. ❌ **Multiple routers in production**
   - ❌ `BrowserRouter` in remote production code
   - ❌ `HashRouter` in remote production code
   - ❌ `MemoryRouter` in remote production code
   - ❌ Any router provider in remote production code

3. ❌ **Mount function pattern**
   - ❌ `mount(container)` function in remotes
   - ❌ Manual DOM container management
   - ❌ Separate React root per remote

4. ❌ **Manual context passing**
   - ❌ Passing `location` via props
   - ❌ Passing `navigate` via props
   - ❌ Passing `routerContext` via props
   - ❌ Custom router context objects
   - ❌ Manual context bridging

5. ❌ **Absolute paths in remotes**
   - ❌ Routes starting with '/' in remote route definitions
   - ❌ Hardcoded base paths in remotes

6. ❌ **Dev entry in production**
   - ❌ Importing dev entry in production code
   - ❌ Exposing dev entry via Module Federation
   - ❌ Production code depending on dev-only logic

---

## 🏗️ Architecture Overview

### Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Host Application (ONE React Root)                       │
│                                                          │
│  createRoot(container)                                  │
│    └─ <React.StrictMode>                                │
│         └─ <ReduxProvider store={store}>                │
│              └─ <BrowserRouter> ← ONE BrowserRouter     │
│                   └─ <Routes>                           │
│                        ├─ <Route path="/login" />       │
│                        ├─ <Route path="/grades/*">      │
│                        │    └─ <GradeRemote /> ← Lazy  │
│                        │         └─ <Routes> ← Nested  │
│                        │              ├─ <Route path="/" /> │
│                        │              └─ <Route path="add" />│
│                        └─ <Route path="/logsheet/*">   │
│                             └─ <LogSheetRemote />       │
└─────────────────────────────────────────────────────────┘
```

### Development Architecture (Standalone Remote)

```
┌─────────────────────────────────────────────────────────┐
│ Remote Application (DEV-ONLY React Root)              │
│                                                          │
│  dev.tsx (DEV-ONLY ENTRY)                               │
│    createRoot(container)                                │
│      └─ <React.StrictMode>                              │
│           └─ <BrowserRouter> ← DEV-ONLY                │
│                └─ <App /> ← Same component as host uses│
│                     └─ <Routes>                         │
│                          └─ <Route path="/" />         │
└─────────────────────────────────────────────────────────┘
```

### Key Points:

1. **Single React Tree in Production**: All components (host + remotes) exist in ONE React tree
2. **Natural Context Flow**: Router context flows from host's `BrowserRouter` to all remotes
3. **Component-Based**: Remotes are React components, not separate applications
4. **Lazy Loading**: Remotes are lazy-loaded via `React.lazy()` and Module Federation
5. **Dev Separation**: Dev entry is completely separate and not used in production

---

## 📁 File Structure

### Host Application

```
agnipariksha/
├── src/
│   ├── index.tsx                    ← ONE createRoot() call
│   ├── App.tsx                      ← ONE BrowserRouter
│   ├── routes/
│   │   └── index.tsx                ← Top-level route definitions
│   └── store/
│       └── index.ts                 ← Redux store
└── package.json
```

### Remote Application

```
apps/grade/
├── src/
│   ├── App.tsx                      ← Default export (React component) - PRODUCTION
│   ├── dev.tsx                      ← Dev-only entry (createRoot + BrowserRouter)
│   ├── routes.tsx                   ← Nested route definitions (relative paths)
│   ├── pages/                       ← Page components
│   │   ├── List.tsx
│   │   ├── Create.tsx
│   │   └── Edit.tsx
│   └── providers/                   ← Module-specific providers
│       ├── ThemeProvider.tsx
│       └── InternalStateProvider.tsx
├── public/
│   └── index.html                   ← Dev-only HTML (for standalone mode)
└── package.json
```

---

## 💻 Implementation

### Host Application (`src/index.tsx`)

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

// EXACTLY ONE createRoot() call - ONLY in host
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* EXACTLY ONE BrowserRouter - remotes inherit this context */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

### Host Routes (`src/App.tsx`)

```tsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy load remotes as React components (NOT mount functions)
const GradeRemote = lazy(() => import("grade/App"));
const LogSheetRemote = lazy(() => import("dynamiclogsheet/App"));
const AiVisionRemote = lazy(() => import("ai-vision/App"));

function App(): React.ReactElement {
  return (
    <Routes>
      {/* Host-owned top-level routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Remote module routes - host owns base path */}
      <Route
        path="/grades/*"
        element={
          <Suspense fallback={<Loading />}>
            <GradeRemote />
          </Suspense>
        }
      />

      <Route
        path="/logsheet/*"
        element={
          <Suspense fallback={<Loading />}>
            <LogSheetRemote />
          </Suspense>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
```

### Remote Application (`apps/grade/src/App.tsx`)

```tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routes, defaultRoute } from "./routes";
import { ThemeProvider } from "./providers/ThemeProvider";

/**
 * Remote Application Component
 * 
 * ✅ Exported as default for Module Federation
 * ✅ Rendered as child of host's BrowserRouter
 * ✅ Inherits router context automatically
 * ✅ Uses relative paths only
 * ✅ Used by BOTH host (production) and dev entry (development)
 */
function GradeApp(): React.ReactElement {
  // ✅ React Router hooks work automatically
  // const navigate = useNavigate();
  // const location = useLocation();
  // const params = useParams();

  return (
    <ThemeProvider>
      {/* ✅ Routes/Route - inherits context from host */}
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </ThemeProvider>
  );
}

// ✅ Default export - host imports this
export default GradeApp;
```

### Remote Dev Entry (`apps/grade/src/dev.tsx`)

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/**
 * DEVELOPMENT-ONLY ENTRY POINT
 * 
 * ✅ This file is DEV-ONLY and MUST NOT be imported by host
 * ✅ Creates createRoot() ONLY for standalone development
 * ✅ Creates BrowserRouter ONLY for standalone development
 * ✅ Uses the same App component that host uses
 */

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container element not found in index.html");
}

// Create React root (DEV-ONLY)
const root = createRoot(container);

// Render with BrowserRouter (DEV-ONLY)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* BrowserRouter is DEV-ONLY - host provides it in production */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### Remote Routes (`apps/grade/src/routes.tsx`)

```tsx
import React from "react";
import GradeList from "./pages/List";
import GradeCreate from "./pages/Create";
import GradeEdit from "./pages/Edit";

// ✅ All paths are RELATIVE (no leading '/')
// ✅ These are nested under /grades/* (defined by host)
export const routes = [
  { path: "/", component: GradeList },        // Matches /grades/
  { path: "add", component: GradeCreate },   // Matches /grades/add
  { path: ":id", component: GradeDetail },   // Matches /grades/:id
  { path: ":id/edit", component: GradeEdit }, // Matches /grades/:id/edit
];

export const defaultRoute = "/";
```

### Remote Page Component (`apps/grade/src/pages/List.tsx`)

```tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function GradeList(): React.ReactElement {
  // ✅ Hooks work automatically - we're inside host's BrowserRouter
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdd = () => {
    // ✅ Navigate using relative path
    navigate("add"); // Goes to /grades/add
    // OR absolute path
    navigate("/grades/add"); // Also works
  };

  return (
    <div>
      <h1>Grade List</h1>
      <button onClick={handleAdd}>Add Grade</button>
    </div>
  );
}

export default GradeList;
```

---

## 🔧 Module Federation Configuration

### Host Webpack Config

```js
const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        grade: "grade@http://localhost:3105/remoteEntry.js",
        dynamiclogsheet: "dynamiclogsheet@http://localhost:3106/remoteEntry.js",
        "ai-vision": "ai-vision@http://localhost:3107/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.0.0" },
        "react-redux": { singleton: true, requiredVersion: "^8.0.0" },
      },
    }),
  ],
  entry: {
    main: "./src/index.tsx", // Host entry with createRoot()
  },
};
```

### Remote Webpack Config (Development)

```js
const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  mode: "development",
  plugins: [
    new ModuleFederationPlugin({
      name: "grade",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx", // ✅ Expose App component, NOT dev entry
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.0.0" },
        "react-redux": { singleton: true, requiredVersion: "^8.0.0" },
      },
    }),
  ],
  entry: {
    dev: "./src/dev.tsx", // ✅ Dev-only entry for standalone development
  },
};
```

### Remote Webpack Config (Production)

```js
const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  mode: "production",
  plugins: [
    new ModuleFederationPlugin({
      name: "grade",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx", // ✅ Expose App component
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.0.0" },
        "react-redux": { singleton: true, requiredVersion: "^8.0.0" },
      },
    }),
  ],
  entry: {
    // ✅ No dev entry in production - App is exposed via Module Federation
  },
};
```

---

## 🎯 Why This Architecture?

### 1. **Single React Root in Production**

**Why**: React applications should have ONE root. Multiple roots create:
- Memory overhead
- Context isolation issues
- Complex state management
- Performance degradation

**How**: Host creates ONE root, remotes are components in that tree.

### 2. **Natural Context Flow**

**Why**: React Context flows through component tree automatically. Manual passing:
- Adds complexity
- Creates coupling
- Requires synchronization
- Prone to errors

**How**: Remotes are children of host's `BrowserRouter`, context flows naturally.

### 3. **Component-Based Remotes**

**Why**: Remotes as components:
- Simpler mental model
- Standard React patterns
- Easy to test
- Better TypeScript support

**How**: Remotes export React components, host renders them.

### 4. **Clean Dev/Prod Separation**

**Why**: Separate dev entry:
- Allows standalone development
- Keeps production code clean
- No dev dependencies in production
- Clear separation of concerns

**How**: Dev entry creates root and router, production uses host's root and router.

### 5. **Enterprise Benefits**

- ✅ **Scalability**: Easy to add new remotes
- ✅ **Maintainability**: Standard React patterns
- ✅ **Performance**: Single React tree, optimized rendering
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Developer Experience**: Standard React tooling works
- ✅ **Testing**: Remotes can be tested as components

---

## 🚫 Common Mistakes to Avoid

### ❌ Mistake 1: Multiple React Roots in Production

```tsx
// ❌ WRONG - Remote creates its own root in production
// apps/grade/src/App.tsx
import { createRoot } from "react-dom/client";
const root = createRoot(container);
root.render(<App />);
```

```tsx
// ✅ CORRECT - Remote exports component
// apps/grade/src/App.tsx
export default function GradeApp() {
  return <Routes>...</Routes>;
}
```

### ❌ Mistake 2: BrowserRouter in Remote Production Code

```tsx
// ❌ WRONG - Remote creates BrowserRouter in production
// apps/grade/src/App.tsx
function GradeApp() {
  return (
    <BrowserRouter>
      <Routes>...</Routes>
    </BrowserRouter>
  );
}
```

```tsx
// ✅ CORRECT - Remote uses Routes only
// apps/grade/src/App.tsx
function GradeApp() {
  return (
    <Routes>
      <Route path="/" element={<GradeList />} />
    </Routes>
  );
}
```

### ❌ Mistake 3: Mount Function Pattern

```tsx
// ❌ WRONG - Remote exposes mount function
// apps/grade/src/mount.tsx
export async function mount(container, props) {
  const root = createRoot(container);
  root.render(<App />);
}
```

```tsx
// ✅ CORRECT - Remote exports component
// apps/grade/src/App.tsx
export default function GradeApp() {
  return <Routes>...</Routes>;
}
```

### ❌ Mistake 4: Manual Context Passing

```tsx
// ❌ WRONG - Passing context manually
<GradeRemote location={location} navigate={navigate} />
```

```tsx
// ✅ CORRECT - Context flows naturally
<GradeRemote />
```

### ❌ Mistake 5: Absolute Paths in Remotes

```tsx
// ❌ WRONG - Absolute paths
export const routes = [
  { path: "/grades/", component: GradeList },
  { path: "/grades/add", component: GradeCreate },
];
```

```tsx
// ✅ CORRECT - Relative paths
export const routes = [
  { path: "/", component: GradeList },      // /grades/
  { path: "add", component: GradeCreate }, // /grades/add
];
```

### ❌ Mistake 6: Dev Entry in Production

```tsx
// ❌ WRONG - Importing dev entry in production
import App from "grade/dev";
```

```tsx
// ✅ CORRECT - Importing App component
import App from "grade/App";
```

---

## 📊 Comparison: Mount Pattern vs Component Pattern

| Aspect | Mount Pattern (Old) | Component Pattern (Enterprise) |
|--------|---------------------|-------------------------------|
| React Roots | Multiple (one per remote) | One (host only) |
| Context Flow | Manual passing required | Automatic inheritance |
| Complexity | High (mount functions, context bridging) | Low (standard React) |
| Type Safety | Limited | Full TypeScript support |
| Testing | Complex (need to mock mount) | Simple (test as component) |
| Performance | Multiple React trees | Single optimized tree |
| Developer Experience | Non-standard patterns | Standard React patterns |
| Dev/Prod Separation | Mixed concerns | Clean separation |

---

## ✅ Summary

This enterprise architecture provides:

1. **Simplicity**: Standard React patterns, no custom abstractions
2. **Performance**: Single React tree, optimized rendering
3. **Maintainability**: Clear separation of concerns
4. **Scalability**: Easy to add new remotes
5. **Type Safety**: Full TypeScript support
6. **Developer Experience**: Standard React tooling works
7. **Clean Separation**: Dev and production code are separate

**Key Takeaway**: Remotes are React components, not separate applications. They inherit context naturally from the host, eliminating the need for manual context passing or multiple React roots. Development mode uses a separate entry point for standalone testing.

