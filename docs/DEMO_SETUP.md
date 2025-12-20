# Demo Setup Guide

This document explains how to run the complete micro-frontend demo.

## 📁 Structure

```
microfrontend-demo/
├── host/                      # Host application
│   ├── src/
│   │   ├── index.tsx         # ONE createRoot() + BrowserRouter
│   │   ├── App.tsx           # Main app with routes & error boundaries
│   │   ├── components/       # Navigation, Notifications
│   │   ├── store/            # Redux store (shared with remotes)
│   │   └── styles/           # Global CSS with Tailwind
│   └── package.json
├── remotes/
│   ├── grade/                # Grade module (with Zustand)
│   │   ├── src/
│   │   │   ├── App.tsx      # Production component
│   │   │   ├── dev.tsx      # Dev-only entry (BrowserRouter + Redux)
│   │   │   ├── pages/       # Demo pages with Redux integration
│   │   │   ├── hooks/       # useReduxStore hooks
│   │   │   └── store/       # Zustand + standalone Redux
│   │   └── package.json
│   ├── dynamiclogsheet/      # Log Sheet module
│   └── ai-vision/            # AI Vision module
├── docs/                     # Comprehensive documentation
├── research-templates/       # Research and template files
├── shared/                   # Shared webpack configs
└── package.json              # Root package.json with convenient scripts
```

## 🚀 Running the Demo

### Prerequisites

```bash
# Install Node.js 18+ and npm
node --version  # Should be 18+
npm --version
```

### Step 1: Install Dependencies

From the `microfrontend-demo` directory:

```bash
# Option A: Install all at once (recommended)
npm run install:all

# Option B: Install manually
npm install
cd host && npm install && cd ..
cd remotes/grade && npm install && cd ..
cd remotes/dynamiclogsheet && npm install && cd ..
cd remotes/ai-vision && npm install && cd ../..
```

### Step 2: Start All Applications

**Option A: Using Root Package.json Scripts (Recommended)**

From the root `microfrontend-demo` directory, run in separate terminals:

```bash
# Terminal 1
npm run dev:host

# Terminal 2
npm run dev:grade

# Terminal 3
npm run dev:logsheet

# Terminal 4
npm run dev:ai-vision
```

**Option B: Using Individual App Scripts**

```bash
# Terminal 1
cd host && npm run dev

# Terminal 2
cd remotes/grade && npm run dev

# Terminal 3
cd remotes/dynamiclogsheet && npm run dev

# Terminal 4
cd remotes/ai-vision && npm run dev
```

### Step 3: Access Applications

Once all servers are running:

- **Host (with all remotes)**: http://localhost:3000
- **Grade Module (standalone)**: http://localhost:3105
- **Log Sheet Module (standalone)**: http://localhost:3106
- **AI Vision Module (standalone)**: http://localhost:3107

## ✅ Testing the Demo

### Test Host Integration

1. Open http://localhost:3000
2. Click "Grades" in navigation
3. Verify grade list loads
4. Click "Add New Grade"
5. Verify navigation works
6. Click browser back button
7. Verify it works correctly
8. Refresh page on `/grades/add`
9. Verify page loads correctly (deep linking)

### Test Remote Standalone Mode

1. Open http://localhost:3105 (Grade module standalone)
2. Verify it loads with its own BrowserRouter and Redux Provider
3. Navigate between pages
4. Verify routing works independently
5. Test Redux integration (should use mock standalone store)
6. Check for "Standalone Development Mode" alert banner

### Test Router Context Inheritance

1. In host (http://localhost:3000), navigate to `/grades/`
2. Open browser console
3. Check that `useNavigate()` and `useLocation()` hooks work
4. Navigate to `/grades/add`
5. Verify URL updates correctly
6. Verify navigation state is maintained

### Test Redux Store Integration

1. Navigate to host home page (http://localhost:3000)
2. Use counter buttons to increment/decrement
3. Navigate to Grade module (`/grades`)
4. See the same counter value displayed
5. Click "Increment from Grade Module" button
6. Counter updates and shows notification
7. Navigate to Log Sheet module
8. Click "Decrement from Log Sheet" button
9. Counter updates and shows notification
10. Navigate back to home - counter value persists

This demonstrates cross-module state sharing via Redux.

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change ports in webpack.config.js files
```

### Module Federation Errors

If remotes don't load:

1. Check all remote servers are running
2. Verify remoteEntry.js is accessible:
   - http://localhost:3105/remoteEntry.js
   - http://localhost:3106/remoteEntry.js
   - http://localhost:3107/remoteEntry.js
3. Check browser console for errors
4. Verify webpack configs match

### TypeScript Errors

If you see TypeScript errors:

1. Ensure all `node_modules` are installed
2. Check `tsconfig.json` in each app
3. Restart TypeScript server in IDE

## 📝 Next Steps

After testing the demo:

1. Review the code structure
2. Read [ENTERPRISE_COMPONENT_ARCHITECTURE.md](./ENTERPRISE_COMPONENT_ARCHITECTURE.md)
3. Adapt to your own projects
4. Follow the architecture constraints
