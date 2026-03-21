[⬅️ Back to Master Index](../README.md)\n\n# Quick Start: Enterprise Component Architecture

## 🚀 Host Setup (5 minutes)

### 1. Create Root (`src/index.tsx`)

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

// EXACTLY ONE createRoot() - ONLY in host
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

### 2. Host Routes (`src/App.tsx`)

```tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load remotes as components
const StudentGradesRemote = lazy(() => import("student-grades/App"));
const ActivityLogRemote = lazy(() => import("activity-log/App"));

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/student-grades/*"
        element={
          <Suspense fallback={<Loading />}>
            <StudentGradesRemote />
          </Suspense>
        }
      />
      <Route
        path="/activity-log/*"
        element={
          <Suspense fallback={<Loading />}>
            <ActivityLogRemote />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

---

## 🎯 Remote Setup (5 minutes)

### 1. Remote App (`src/App.tsx`) - PRODUCTION

```tsx
import { Routes, Route } from "react-router-dom";
import { routes, defaultRoute } from "./routes";

// ✅ Default export - host imports this
export default function GradeApp() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={<route.component />} />
      ))}
    </Routes>
  );
}
```

### 2. Remote Dev Entry (`src/dev.tsx`) - DEVELOPMENT ONLY

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import { standaloneStore } from "./store/standaloneStore";

// DEV-ONLY - NOT imported by host
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={standaloneStore}>
      <ThemeProvider theme={theme}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
```

### 3. Remote Routes (`src/routes.tsx`)

```tsx
// ✅ All paths are RELATIVE (no leading '/')
export const routes = [
  { path: "/", component: StudentGradesList },      // /student-grades/
  { path: "add", component: StudentGradesCreate }, // /student-grades/add
  { path: ":id", component: StudentGradesDetail },  // /student-grades/:id
];
```

### 4. Module Federation Config

```js
// webpack.config.js
exposes: {
  "./App": "./src/App.tsx", // ✅ Expose App component
},
entry: {
  dev: "./src/dev.tsx", // ✅ Dev-only entry
},
```

---

## ✅ Key Rules

- ✅ ONE `createRoot()` - host only
- ✅ ONE `BrowserRouter` - host only (with future flags)
- ✅ Remotes are components - no mount functions
- ✅ Context flows naturally - no manual passing
- ✅ Dev entry separate - not used in production
- ✅ Standalone mode - remotes can run independently with mock Redux store
- ✅ Redux hooks - use `hooks/useReduxStore` for safe host/standalone compatibility

## 📚 Related Documentation

- **[ENTERPRISE_COMPONENT_ARCHITECTURE.md](./ENTERPRISE_COMPONENT_ARCHITECTURE.md)** - Complete architecture documentation
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Current project structure
- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - Detailed setup guide

## 🚀 Current Implementation

The actual working implementation includes:
- Root `package.json` with convenient scripts (`npm run dev:host`, `npm run dev:student-grades`, etc.)
- Framer Motion animations
- Enhanced error handling with user-friendly error messages
- React Router future flags to suppress warnings
- Standalone Redux stores for independent remote development
- Safe Redux hooks that work in both host and standalone modes
