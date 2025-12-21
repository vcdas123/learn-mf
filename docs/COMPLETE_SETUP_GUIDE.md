# Complete Setup & Configuration Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Configuration Files](#configuration-files)
4. [State Management](#state-management)
5. [Styling Architecture](#styling-architecture)
6. [Module Federation Setup](#module-federation-setup)
7. [Development Workflow](#development-workflow)
8. [Production Deployment](#production-deployment)

## 🎯 Project Overview

This is a complete enterprise-grade micro-frontend demonstration with:

- **Host Application**: Single entry point with React root and BrowserRouter
- **3 Remote Applications**: Student Grades, Activity Log, Image Analyzer
- **Shared State**: Redux store in host, accessible by all remotes
- **Module State**: Zustand stores in remotes for module-specific state
- **Modern UI**: Material-UI components with Tailwind CSS utilities
- **Module Federation**: Webpack 5 Module Federation for runtime loading

## 📁 Complete Folder Structure

### Host Application

```
host/
├── src/
│   ├── index.tsx                 # Entry: createRoot() + BrowserRouter
│   ├── App.tsx                   # Main app component with routes
│   ├── components/
│   │   └── NotificationSystem.tsx # Toast notification component
│   ├── store/
│   │   ├── index.ts              # Redux store configuration
│   │   └── slices/
│   │       ├── appSlice.ts       # App state (theme, notifications, currentModule)
│   │       └── counterSlice.ts   # Counter demo (shared with remotes)
│   ├── styles/
│   │   └── globals.css           # Tailwind + global styles
│   └── assets/                   # Assets imported in code (webpack processed)
│       ├── images/               # Import in code: import img from '../assets/images/...'
│       └── fonts/                # Use in CSS: url('../assets/fonts/...')
│                            # Note: Favicons go in public/assets/favicons/
├── public/
│   ├── index.html                # HTML template
│   └── assets/                   # Static assets referenced by URL (copied as-is)
│       ├── images/               # Reference in HTML: src="/assets/images/..."
│       ├── fonts/                # Reference in HTML: href="/assets/fonts/..."
│       └── favicons/             # Reference in HTML: href="/assets/favicons/..."
├── public/
│   └── index.html                # HTML template
├── dist/                         # Build output
├── webpack.config.js             # Host webpack config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

### Remote Application (Example: Image Analyzer)

```
remotes/image-analyzer/
├── src/
│   ├── App.tsx                   # Production component (exported)
│   ├── dev.tsx                   # Dev entry (creates own root + router + Redux Provider)
│   ├── routes.tsx                # Route definitions
│   ├── pages/
│   │   ├── Dashboard.tsx         # Dashboard page (with Redux integration)
│   │   └── Analyze.tsx           # Analysis page (with animations)
│   ├── store/
│   │   └── standaloneStore.ts    # Mock Redux store (standalone mode)
│   ├── hooks/
│   │   └── useReduxStore.ts      # Safe Redux hooks (host/standalone)
│   ├── styles/
│   │   └── module.css            # Module-specific styles (optional)
│   └── assets/                   # Assets imported in code (webpack processed)
│       ├── images/
│       └── fonts/
│                            # Note: Favicons go in public/assets/favicons/
├── public/
│   ├── index.html                # Standalone HTML
│   └── assets/                   # Static assets referenced by URL (copied as-is)
│       ├── images/
│       ├── fonts/
│       └── favicons/
├── dist/                         # Build output
├── webpack.config.js             # Remote webpack config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies (includes framer-motion, react-redux)
```

### Shared Configuration

```
sharedConfigs/
├── webpack.common.js             # Common webpack configuration
├── webpack.module-federation.js  # Module Federation setup
├── tailwind.config.js            # Tailwind CSS configuration
└── postcss.config.js             # PostCSS (Tailwind + autoprefixer)
```

## ⚙️ Configuration Files Explained

### 1. Webpack Configuration

#### `sharedConfigs/webpack.common.js`

**Purpose**: Common configuration merged by all apps

**Features**:

- TypeScript/JavaScript loaders (ts-loader, babel-loader)
- CSS/SCSS loaders with CSS modules support
- Asset loaders (images, fonts, favicons)
- HTML plugin configuration
- CSS extraction (production only)
- Code splitting (production only)

**Key Rules**:

- Images < 8kb are inlined as base64
- CSS modules auto-detection (`.module.css`, `.module.scss`)
- Tailwind CSS processing via PostCSS

#### `sharedConfigs/webpack.module-federation.js`

**Purpose**: Module Federation configuration

**Features**:

- Shared dependencies configuration (singletons)
- Host remote configuration
- Remote expose configuration
- Handles hyphenated remote names (e.g., "image-analyzer" → "image_analyzer")

**Shared Dependencies** (all eager: true):

- `react`, `react-dom`
- `react-router-dom`
- `react-redux`, `@reduxjs/toolkit`
- `zustand` (eager for standalone mode compatibility)
- `@mui/material`, `@mui/icons-material`
- `@emotion/react`, `@emotion/styled`

#### `host/webpack.config.js`

**Purpose**: Host-specific configuration

**Features**:

- Entry: `./src/index.tsx`
- Port: From `.env` (default: 3000)
- Merges with `webpack.common.js`
- Output: `host/dist/`
- Module Federation: Consumes remotes

#### `remotes/*/webpack.config.js`

**Purpose**: Remote-specific configuration

**Features**:

- Entry: `./src/dev.tsx` (development only)
- No entry in production builds
- Port: From `.env` (3105, 3106, 3107)
- Output: `remotes/*/dist/`
- Module Federation: Exposes `./App`

### 2. Environment Configuration

#### `.env`

```env
HOST_PORT=3000
REMOTE_STUDENT_GRADES_PORT=3105
REMOTE_ACTIVITY_LOG_PORT=3106
REMOTE_IMAGE_ANALYZER_PORT=3107
REMOTE_STUDENT_GRADES_URL=http://localhost:3105
REMOTE_ACTIVITY_LOG_URL=http://localhost:3106
REMOTE_IMAGE_ANALYZER_URL=http://localhost:3107
```

**Usage**: Loaded by `dotenv` in webpack configs

### 3. TypeScript Configuration

Each app has `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": false // Important: Must be false for webpack
  }
}
```

### 4. Tailwind Configuration

#### `sharedConfigs/tailwind.config.js`

```javascript
module.exports = {
  content: [
    "./host/src/**/*.{js,jsx,ts,tsx}",
    "./remotes/**/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
```

**Content Paths**: Scans all source files for Tailwind classes

#### `sharedConfigs/postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 🔄 State Management Architecture

### Host Redux Store

**Location**: `host/src/store/`

**Structure**:

```typescript
{
  app: {
    theme: "light" | "dark",
    currentModule: string | null,
    notifications: Notification[],
    user: User | null,
  },
  counter: {
    value: number,
    history: number[],
  },
}
```

**Slices**:

1. **appSlice.ts** - Application-wide state

   - Actions: `setTheme`, `setCurrentModule`, `addNotification`, `removeNotification`, `setUser`

2. **counterSlice.ts** - Demo counter (testable from remotes)
   - Actions: `increment`, `decrement`, `incrementByAmount`, `reset`

### Using Redux in Remotes

**Import Types**:

```typescript
import type { RootState } from "../../../../host/src/store";
```

**Access State**:

```typescript
const counter = useSelector((state: RootState) => state.counter.value);
const notifications = useSelector(
  (state: RootState) => state.app.notifications
);
```

**Dispatch Actions**:

```typescript
// Using action type strings (works across Module Federation)
dispatch({ type: "counter/increment" });
dispatch({
  type: "app/addNotification",
  payload: { message: "Hello!", type: "success" },
});
```

### Module-Specific State (Zustand)

**Example**: `remotes/student-grades/src/store/useGradeStore.ts`

```typescript
import { create } from "zustand";

export const useGradeStore = create((set) => ({
  grades: [],
  addGrade: (grade) => set((state) => ({ grades: [...state.grades, grade] })),
}));
```

**Usage**:

```typescript
const grades = useGradeStore((state) => state.grades);
const addGrade = useGradeStore((state) => state.addGrade);
```

## 🎨 Styling Architecture

### Styling Approaches

1. **Tailwind CSS Utilities**

   ```tsx
   <div className="p-4 bg-blue-50 rounded-lg shadow-md">
   ```

2. **MUI Components**

   ```tsx
   <Button variant="contained" color="primary">
   ```

3. **MUI sx Prop**

   ```tsx
   <Box sx={{ padding: 2, backgroundColor: 'primary.main' }}>
   ```

4. **CSS Modules**

   ```tsx
   import styles from './Component.module.css';
   <div className={styles.container}>
   ```

5. **Global CSS**
   ```css
   /* In globals.css or component CSS */
   .custom-class {
     ...;
   }
   ```

### File Organization

**Global Styles**: `host/src/styles/globals.css`

- Tailwind directives
- Custom animations
- Global resets
- Custom scrollbar

**Module Styles**: `remotes/*/src/styles/`

- Module-specific global styles
- CSS modules per component

**Component Styles**: Co-located with components

- `ComponentName.module.css`
- `ComponentName.module.scss`

## 🔗 Module Federation Setup

### Remote Name Handling

**Problem**: Hyphenated names (e.g., "image-analyzer") aren't valid JavaScript identifiers

**Solution**: Use `library.name` with underscores in remote config:

```javascript
// Remote config for "image-analyzer"
{
  name: "image-analyzer",       // Remote name (for import)
  library: {
    type: "var",
    name: "image_analyzer",         // Valid JS identifier (no hyphens)
  },
}
```

**Host Config**:

```javascript
remotes: {
  "image-analyzer": "image_analyzer@http://localhost:3107/remoteEntry.js",
}
```

### Shared Dependencies

All critical dependencies are shared as singletons with `eager: true`:

- Ensures immediate availability
- Prevents multiple instances
- Maintains version consistency

## 🚀 Development Workflow

### Starting Applications

**Option 1: Using Root Package.json Scripts (Recommended)**

```bash
# Terminal 1
npm run dev:host

# Terminal 2
npm run dev:image-analyzer

# Terminal 3
npm run dev:student-grades

# Terminal 4
npm run dev:activity-log
```

**Option 2: Individual Terminals**

```bash
# Terminal 1
cd host && npm run dev

# Terminal 2
cd remotes/image-analyzer && npm run dev
```

**Option 3: Background Processes**

```bash
npm run dev:host &
npm run dev:image-analyzer &
```

### Testing Remote Integration

1. Start host and remote servers
2. Navigate to http://localhost:3000
3. Click navigation to remote module
4. Verify:
   - Remote loads successfully
   - Routing works correctly
   - Redux store accessible
   - Styling applied correctly

### Testing Standalone Mode

1. Start only the remote server
2. Navigate to http://localhost:3107 (for AI Vision)
3. Verify it works independently

## 🏭 Production Deployment

### Build Process

**Using Root Package.json Scripts (Recommended)**:

```bash
# Build all remotes first
npm run build:remotes

# Or build individually
npm run build:student-grades
npm run build:activity-log
npm run build:image-analyzer

# Then build host
npm run build:host

# Or build everything at once
npm run build:all
```

**Manual Build**:

1. **Build Remotes First**:

   ```bash
   cd remotes/student-grades && npm run build && cd ../..
   cd remotes/activity-log && npm run build && cd ../..
   cd remotes/image-analyzer && npm run build && cd ../..
   ```

2. **Deploy Remotes**:

   - Upload each `dist/` folder to CDN/server
   - Ensure `remoteEntry.js` is accessible at configured URLs

3. **Update Host Config**:

   - Update `.env` with production remote URLs
   - Or modify `webpack.module-federation.js` directly

4. **Build Host**:

   ```bash
   cd host && npm run build
   ```

5. **Deploy Host**:
   - Upload `host/dist/` to production server

### Production Considerations

- **No Dev Entries**: Remotes have no entry points in production
- **CSS Extraction**: Styles extracted to separate files
- **Code Splitting**: Vendor chunks separated
- **Minification**: All code minified
- **Source Maps**: Generated for debugging (optional)

## 📚 Additional Resources

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Detailed structure
- [ASSET_STRUCTURE.md](./ASSET_STRUCTURE.md) - Asset organization
- [docs/ENTERPRISE_COMPONENT_ARCHITECTURE.md](./docs/ENTERPRISE_COMPONENT_ARCHITECTURE.md) - Architecture guide
