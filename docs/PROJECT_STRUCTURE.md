# Project Structure & Documentation

## 📁 Complete Folder Structure

```
microfrontend-demo/
├── host/                           # Host Application
│   ├── src/
│   │   ├── index.tsx              # Entry point (ONE createRoot())
│   │   ├── App.tsx                # Main app component (ONE BrowserRouter)
│   │   ├── components/            # Host-specific components
│   │   │   └── NotificationSystem.tsx
│   │   ├── store/                 # Redux store (shared with remotes)
│   │   │   ├── index.ts           # Store configuration
│   │   │   └── slices/            # Redux slices
│   │   │       ├── appSlice.ts    # App state (theme, notifications, etc.)
│   │   │       └── counterSlice.ts # Counter state (demo)
│   │   ├── styles/                # Global styles
│   │   │   └── globals.css        # Tailwind + global CSS
│   │   └── assets/                # Assets imported in code (webpack processed)
│   │       ├── images/            # Import in code: import img from '../assets/images/...'
│   │       └── fonts/             # Use in CSS: url('../assets/fonts/...')
│   │                              # Note: Favicons go in public/assets/favicons/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/                # Static assets referenced by URL (copied as-is)
│   │       ├── images/            # Reference in HTML: src="/assets/images/..."
│   │       ├── fonts/             # Reference in HTML: href="/assets/fonts/..."
│   │       └── favicons/          # Reference in HTML: href="/assets/favicons/..."
│   ├── dist/                      # Build output
│   ├── webpack.config.js          # Host webpack config
│   ├── tsconfig.json
│   └── package.json
│
├── remotes/                        # Remote Applications
│   ├── grade/                     # Grade Module
│   │   ├── src/
│   │   │   ├── App.tsx            # Production component (exported)
│   │   │   ├── dev.tsx            # Dev-only entry (standalone)
│   │   │   ├── routes.tsx         # Route definitions
│   │   │   ├── pages/             # Page components
│   │   │   │   ├── List.tsx
│   │   │   │   ├── Create.tsx
│   │   │   │   └── Detail.tsx
│   │   │   ├── store/             # Module stores
│   │   │   │   ├── useGradeStore.ts # Zustand store (module-specific)
│   │   │   │   └── standaloneStore.ts # Mock Redux store (standalone mode)
│   │   │   ├── hooks/             # Custom hooks
│   │   │   │   └── useReduxStore.ts # Safe Redux hooks (host/standalone)
│   │   │   ├── styles/            # Module styles
│   │   │   └── assets/            # Assets imported in code (webpack processed)
│   │   │       ├── images/
│   │   │       └── fonts/
│   │   │                          # Note: Favicons go in public/assets/favicons/
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── assets/            # Static assets referenced by URL (copied as-is)
│   │   │       ├── images/
│   │   │       ├── fonts/
│   │   │       └── favicons/
│   │   ├── dist/
│   │   ├── webpack.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── dynamiclogsheet/           # Log Sheet Module
│   │   └── [similar structure]
│   │
│   └── ai-vision/                 # AI Vision Module
│       └── [similar structure]
│
├── sharedConfigs/                         # Shared Configuration
│   ├── webpack.common.js          # Common webpack config
│   ├── webpack.module-federation.js # Module Federation config
│   ├── tailwind.config.js         # Tailwind configuration
│   └── postcss.config.js          # PostCSS configuration
│
├── public/                         # Shared public assets
│   └── index.html
│
├── docs/                           # Comprehensive Documentation
│   ├── README.md                   # Documentation index
│   ├── PROJECT_STRUCTURE.md        # This file
│   ├── COMPLETE_SETUP_GUIDE.md     # Setup and configuration guide
│   ├── ENTERPRISE_COMPONENT_ARCHITECTURE.md # Architecture principles
│   ├── QUICK_START_ENTERPRISE.md   # Quick reference
│   ├── ASSET_STRUCTURE.md          # Asset organization
│   └── DEMO_SETUP.md               # Demo setup instructions
│
├── research-templates/             # Research and Template Files
│   ├── README.md                   # Templates documentation
│   ├── HostApp.enterprise.tsx      # Host app template
│   ├── RemoteApp.enterprise.tsx    # Remote app template
│   ├── RemoteDevEntry.enterprise.tsx # Dev entry template
│   └── ModuleFederationConfig.enterprise.js # MF config template
│
├── package.json                    # Root package.json with convenient scripts
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── .gitignore
└── README.md                       # Main README
```

## 🏗️ Architecture Overview

### Host Application (`host/`)

**Responsibilities:**
- Single React root (`createRoot()`)
- Single `BrowserRouter`
- Redux store provider (shared with all remotes)
- Top-level routing
- Navigation bar
- Error boundaries for remote loading
- Global state management

**Key Files:**
- `src/index.tsx` - Entry point with React root and BrowserRouter (with future flags)
- `src/App.tsx` - Main app with routes, error boundaries, and navigation
- `src/store/` - Redux store configuration and slices
  - `index.ts` - Store configuration
  - `slices/appSlice.ts` - App state (theme, notifications, currentModule)
  - `slices/counterSlice.ts` - Counter demo (shared with remotes)
- `src/components/` - Host-specific components
  - `NotificationSystem.tsx` - Toast notification system
- `src/styles/globals.css` - Global styles with Tailwind

### Remote Applications (`remotes/*/`)

**Responsibilities:**
- Export pure React component (no `createRoot()`)
- Nested routing (relative paths only)
- Module-specific state (Zustand or local state)
- Access shared Redux store from host

**Key Files:**
- `src/App.tsx` - Production component (exported via Module Federation)
- `src/dev.tsx` - Development entry (standalone mode with BrowserRouter + Redux Provider)
- `src/routes.tsx` - Route definitions
- `src/pages/` - Page components (with Framer Motion animations)
- `src/store/` - Module stores
  - `useGradeStore.ts` / `useModuleStore.ts` - Zustand store (module-specific)
  - `standaloneStore.ts` - Mock Redux store for standalone mode
- `src/hooks/` - Custom hooks
  - `useReduxStore.ts` - Safe Redux hooks (works in both host and standalone modes)

### Shared Configuration (`sharedConfigs/`)

**Purpose:**
- Common webpack configuration
- Module Federation setup
- Tailwind and PostCSS configuration
- Shared dependencies configuration

## 🔧 Configuration Files

### Webpack Configuration

#### `sharedConfigs/webpack.common.js`
- Common loaders (TypeScript, CSS, SCSS, images, fonts)
- Common plugins (HtmlWebpackPlugin, MiniCssExtractPlugin)
- Common optimization settings
- Resolves modules from calling app's `node_modules`

#### `sharedConfigs/webpack.module-federation.js`
- Module Federation plugin configuration
- Shared dependencies (React, MUI, Redux, etc.)
- Host remote configuration
- Remote expose configuration

#### `host/webpack.config.js` & `remotes/*/webpack.config.js`
- Environment-specific config (dev/prod)
- Entry points (remotes have no entry in production)
- Output paths
- Dev server configuration
- Merges with `webpack.common.js`

### TypeScript Configuration

Each app has its own `tsconfig.json`:
- Target: ES2020
- JSX: react-jsx
- Strict mode enabled
- Module resolution: node

### Environment Variables (`.env`)

```env
HOST_PORT=3000
REMOTE_GRADE_PORT=3105
REMOTE_LOGSHEET_PORT=3106
REMOTE_AI_VISION_PORT=3107
REMOTE_GRADE_URL=http://localhost:3105
REMOTE_LOGSHEET_URL=http://localhost:3106
REMOTE_AI_VISION_URL=http://localhost:3107
```

## 📦 Package Dependencies

### Host Dependencies
- `react`, `react-dom` - React core
- `react-router-dom` - Routing
- `react-redux`, `@reduxjs/toolkit` - State management
- `@mui/material`, `@mui/icons-material` - UI components
- `@emotion/react`, `@emotion/styled` - CSS-in-JS

### Remote Dependencies
- Same as host (shared as singletons)
- Additional: `zustand` (for module-specific state)

### Build Tools (All Apps)
- `webpack`, `webpack-cli`, `webpack-dev-server`
- `webpack-merge` - Merge configs
- `ts-loader`, `babel-loader` - TypeScript/JSX compilation
- `css-loader`, `style-loader`, `sass-loader` - Styles
- `postcss-loader`, `tailwindcss` - Tailwind CSS
- `mini-css-extract-plugin` - CSS extraction (production)
- `html-webpack-plugin` - HTML generation
- `dotenv` - Environment variables

## 🎨 Styling Architecture

### Global Styles (`host/src/styles/globals.css`)
- Tailwind directives (`@tailwind base/components/utilities`)
- Custom scrollbar styles
- Animations (fadeIn, etc.)
- Global resets

### Tailwind CSS (`sharedConfigs/tailwind.config.js`)
- Content paths for all apps
- Theme customization
- Custom utilities

### Component Styles
- **MUI Components**: Use Material-UI's `sx` prop or `styled` API
- **Tailwind Utilities**: Use Tailwind classes directly
- **CSS Modules**: For component-specific styles (`.module.css` or `.module.scss`)
- **Global CSS**: For shared styles across modules

### Style Organization
```
src/
├── styles/
│   ├── globals.css           # Global styles
│   ├── variables.css         # CSS variables (optional)
│   └── animations.css        # Custom animations (optional)
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.module.css  # Component-specific styles
└── assets/
    └── images/
```

## 🔄 State Management

### Host Redux Store
**Location:** `host/src/store/`

**Slices:**
- `appSlice.ts` - App-level state (theme, notifications, current module)
- `counterSlice.ts` - Demo counter (accessible from remotes)

**Usage in Remotes:**
```typescript
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../host/src/store";

// Access state
const counter = useSelector((state: RootState) => state.counter.value);

// Dispatch actions
dispatch({ type: "counter/increment" });
```

### Remote Zustand Stores
**Location:** `remotes/*/src/store/`

**Purpose:** Module-specific state that doesn't need to be shared

**Example:**
```typescript
import { create } from "zustand";

export const useModuleStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
```

## 🚀 Development vs Production

### Development
- **Host**: Full webpack dev server with HMR
- **Remotes**: Each runs standalone with own dev server
- **Entry Points**: All apps have entry points
- **Source Maps**: Enabled for debugging

### Production
- **Host**: Full build with all remotes loaded
- **Remotes**: No entry points, only exposed via Module Federation
- **CSS**: Extracted to separate files
- **Optimization**: Code splitting, minification, tree shaking

## 📝 Module Federation Configuration

### Shared Dependencies
All shared as singletons with `eager: true`:
- `react`, `react-dom`
- `react-router-dom`
- `react-redux`, `@reduxjs/toolkit`
- `@mui/material`, `@mui/icons-material`
- `@emotion/react`, `@emotion/styled`

### Remote Names
- Standard names: `grade`, `dynamiclogsheet` (no special handling)
- Hyphenated names: `ai-vision` (uses `library.type: "var"` with `ai_vision` identifier)

### Host Remote Configuration
```javascript
remotes: {
  grade: "grade@http://localhost:3105/remoteEntry.js",
  "ai-vision": "ai_vision@http://localhost:3107/remoteEntry.js",
}
```

## 🧪 Testing Setup

### Running Applications

**Development:**
```bash
# Start each app individually
cd host && npm run dev
cd remotes/ai-vision && npm run dev
```

**Production Build:**
```bash
# Build remotes first
cd remotes/ai-vision && npm run build

# Then build host
cd host && npm run build
```

### Accessing Applications
- Host: http://localhost:3000
- Remotes (standalone): http://localhost:3105-3107

## 📚 Key Concepts

### Single React Root
- Only host creates `createRoot()`
- Remotes are components, not separate React apps
- Context flows naturally through component tree

### Routing
- Host owns all top-level routes (`/grades/*`, `/logsheet/*`)
- Remotes own nested routes (relative paths: `"/"`, `"add"`, `":id"`)
- React Router context inherited from host

### State Management
- **Shared State**: Redux store in host (accessible to all remotes)
- **Module State**: Zustand or local state in remotes
- **Communication**: Redux actions dispatched from remotes

### Styling
- **Tailwind CSS**: Utility-first classes
- **MUI Components**: Material Design components
- **CSS Modules**: Component-scoped styles
- **Global CSS**: Shared styles in host

