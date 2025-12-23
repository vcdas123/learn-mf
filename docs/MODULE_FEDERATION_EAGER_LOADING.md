# Module Federation: `eager: true` Explained

## What is `eager: true`?

`eager: true` tells Module Federation to **load and initialize the shared dependency immediately** when the application starts, rather than waiting for it to be needed (lazy loading).

## Default Behavior (Without `eager: true`)

By default, Module Federation uses **lazy loading** for shared dependencies:

```javascript
shared: {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0",
    // eager: false (default) - lazy loading
  }
}
```

**What happens:**
1. Dependency is **not loaded** when the app starts
2. Dependency is loaded **on-demand** when first imported
3. Creates a separate chunk that's loaded asynchronously

## With `eager: true`

```javascript
shared: {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: true, // Load immediately, not on-demand
  }
}
```

**What happens:**
1. Dependency is **loaded immediately** when the app starts
2. Dependency is **bundled into the main entry chunk**
3. No separate chunk is created
4. Available synchronously from the start

## Why Use `eager: true`?

### 1. **Critical Dependencies Must Be Available Immediately**

React, React-DOM, and React Router are **fundamental** to your application:

```javascript
// Without eager: true
// ❌ React might not be loaded when you try to render
import React from 'react'; // Could fail if React isn't loaded yet

// With eager: true
// ✅ React is guaranteed to be available immediately
import React from 'react'; // Always works
```

### 2. **Context Providers Need Early Initialization**

React Router and Redux need to be available **before** any components render:

```typescript
// host/src/index.tsx
root.render(
  <Provider store={store}>      // Redux needs to be loaded
    <BrowserRouter>             // Router needs to be loaded
      <App />
    </BrowserRouter>
  </Provider>
);
```

If these aren't eager-loaded, you might get errors like:
- `Cannot read property 'Provider' of undefined`
- `BrowserRouter is not defined`

### 3. **Standalone Mode Compatibility**

When remotes run in **standalone mode**, they need React and other dependencies available immediately:

```typescript
// remotes/activity-log/src/dev.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// All of these need to be available immediately
// Without eager: true, they might not be loaded yet
```

### 4. **Prevents Race Conditions**

Without `eager: true`, there's a risk of:
- Host trying to use React before it's loaded
- Remote trying to use React Router before it's loaded
- Multiple async chunks loading in unpredictable order

With `eager: true`, all critical dependencies are loaded **synchronously** in the correct order.

## Real-World Example

### Scenario: Host Loading a Remote

**Without `eager: true` (lazy loading):**

```
1. Host app starts
2. User navigates to /activity-log
3. Host tries to load ActivityLogRemote
4. ActivityLogRemote needs React Router
5. React Router chunk needs to be loaded first (async)
6. ⚠️ Potential race condition or delay
```

**With `eager: true` (eager loading):**

```
1. Host app starts
2. React, React Router, Redux are loaded immediately (synchronously)
3. User navigates to /activity-log
4. Host loads ActivityLogRemote
5. ✅ React Router is already available, no delay
```

## When to Use `eager: true`

### ✅ Use `eager: true` for:

1. **Core Framework Dependencies**
   - `react`, `react-dom` - Required for rendering
   - `react-router-dom` - Required for routing
   - `react-redux`, `@reduxjs/toolkit` - Required for state management

2. **UI Library Dependencies**
   - `@mui/material` - Required for components
   - `@emotion/react`, `@emotion/styled` - Required for MUI styling

3. **Dependencies Used in Entry Points**
   - Anything imported in `index.tsx` or `dev.tsx`
   - Anything used in top-level providers

### ❌ Don't Use `eager: true` for:

1. **Large Optional Dependencies**
   - Heavy libraries that might not always be used
   - Code-splitting benefits outweigh eager loading

2. **Feature-Specific Dependencies**
   - Dependencies only used in specific routes
   - Can be lazy-loaded when needed

## Current Configuration

In your project, all shared dependencies use `eager: true`:

```javascript
const sharedDependencies = {
  react: { singleton: true, requiredVersion: "^18.2.0", eager: true },
  "react-dom": { singleton: true, requiredVersion: "^18.2.0", eager: true },
  "react-router-dom": { singleton: true, requiredVersion: "^6.20.0", eager: true },
  "react-redux": { singleton: true, requiredVersion: "^8.1.3", eager: true },
  "@reduxjs/toolkit": { singleton: true, requiredVersion: "^1.9.7", eager: true },
  zustand: { singleton: true, requiredVersion: "^4.4.7", eager: true },
  "@mui/material": { singleton: true, requiredVersion: "^5.15.0", eager: true },
  "@mui/icons-material": { singleton: true, requiredVersion: "^5.15.0", eager: true },
  "@emotion/react": { singleton: true, requiredVersion: "^11.11.1", eager: true },
  "@emotion/styled": { singleton: true, requiredVersion: "^11.11.0", eager: true },
};
```

**Why all of them?**
- All are **critical** for the application to function
- All are used in **entry points** (index.tsx, dev.tsx)
- All need to be available **immediately** for context providers
- All are needed for **standalone mode** to work

## Trade-offs

### ✅ Benefits of `eager: true`

1. **Guaranteed Availability** - Dependencies are always loaded
2. **No Race Conditions** - Synchronous loading prevents timing issues
3. **Standalone Mode Works** - Remotes can run independently
4. **Simpler Mental Model** - Dependencies are "just there"

### ⚠️ Trade-offs

1. **Larger Initial Bundle** - Dependencies are in the main chunk
2. **No Code Splitting** - Can't lazy-load these dependencies
3. **Slower Initial Load** - More code loaded upfront

**However**, for critical dependencies like React, these trade-offs are **worth it** because:
- The dependencies are **always needed** anyway
- The size increase is **minimal** compared to the app code
- The reliability and simplicity benefits **outweigh** the costs

## Comparison: `eager: true` vs `eager: false`

### `eager: false` (Default - Lazy Loading)

```javascript
shared: {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: false, // or omit (default)
  }
}
```

**Bundle Structure:**
```
main.js (app code)
react-vendor.js (separate chunk, loaded on-demand)
```

**Loading Flow:**
```
1. Load main.js
2. App starts
3. When React is needed → Load react-vendor.js (async)
4. Use React
```

### `eager: true` (Eager Loading)

```javascript
shared: {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: true,
  }
}
```

**Bundle Structure:**
```
main.js (app code + React bundled together)
```

**Loading Flow:**
```
1. Load main.js (includes React)
2. App starts (React already available)
3. Use React (no async loading needed)
```

## Summary

`eager: true` means:
- ✅ Load the dependency **immediately** when the app starts
- ✅ Bundle it into the **main entry chunk** (not a separate chunk)
- ✅ Make it available **synchronously** (no async loading)
- ✅ Ensure it's **always available** before any code runs

**Use it for critical dependencies** that your application **must have** to function, especially those used in entry points and context providers.

