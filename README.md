# Enterprise Micro-Frontend Demo

Complete working demo of enterprise-grade micro-frontend architecture using Webpack Module Federation with React, Redux, MUI, Tailwind CSS, and Framer Motion.

## 🏗️ Architecture

- **ONE React root** - Only in host application
- **ONE BrowserRouter** - Only in host application
- **Remotes as pure React components** - No mount functions
- **Natural context flow** - React Router context flows automatically
- **Redux shared** - Host Redux store available to remotes
- **Zustand support** - Remotes can use Zustand for module-specific state
- **MUI support** - Material-UI components available
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Beautiful animations and transitions

## 📁 Project Structure

```
microfrontend-demo/
├── host/                    # Host application
│   ├── src/
│   │   ├── index.tsx       # ONE createRoot() call
│   │   ├── App.tsx         # ONE BrowserRouter + routing
│   │   ├── components/     # Host components (Navigation, Notifications)
│   │   ├── store/          # Redux store (shared with remotes)
│   │   │   ├── index.ts    # Store configuration
│   │   │   └── slices/     # Redux slices (appSlice, counterSlice)
│   │   ├── styles/         # Global CSS with Tailwind
│   │   └── assets/         # Images, fonts, favicons
│   └── package.json
├── remotes/
│   ├── grade/              # Grade module (Zustand store)
│   ├── dynamiclogsheet/    # Dynamic Log Sheet module
│   └── ai-vision/          # AI Vision module
├── shared/                  # Shared webpack configs
│   ├── webpack.common.js   # Common webpack config
│   ├── webpack.module-federation.js # Module Federation config
│   ├── postcss.config.js   # PostCSS config (Tailwind)
│   └── tailwind.config.js  # Tailwind config
├── docs/                    # Comprehensive documentation
│   ├── README.md           # Documentation index
│   ├── PROJECT_STRUCTURE.md # Complete folder structure
│   ├── COMPLETE_SETUP_GUIDE.md # Setup and configuration
│   ├── ENTERPRISE_COMPONENT_ARCHITECTURE.md # Architecture guide
│   ├── research-templates/ # Research and template files
│   │   ├── HostApp.enterprise.tsx
│   │   ├── RemoteApp.enterprise.tsx
│   │   └── ModuleFederationConfig.enterprise.js
│   └── ...                 # More documentation files
├── package.json             # Root package.json with convenient scripts
├── .env                     # Environment variables (ports, URLs)
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

**Option 1: Install all at once (Recommended)**

```bash
npm run install:all
```

**Option 2: Install individually**

```bash
npm run install:host
npm run install:grade
npm run install:logsheet
npm run install:ai-vision
```

### 2. Configure Environment

The `.env` file should already exist with default ports. You can modify it if needed:

```bash
HOST_PORT=3000
REMOTE_GRADE_PORT=3105
REMOTE_LOGSHEET_PORT=3106
REMOTE_AI_VISION_PORT=3107
```

### 3. Start Development Servers

**Using Root Package.json Scripts (Recommended)**

Start each application using the convenient root-level scripts:

```bash
# Terminal 1: Host
npm run dev:host

# Terminal 2: Grade Remote
npm run dev:grade

# Terminal 3: Log Sheet Remote
npm run dev:logsheet

# Terminal 4: AI Vision Remote
npm run dev:ai-vision
```

**Or manually:**

```bash
cd host && npm run dev
cd remotes/grade && npm run dev
# etc...
```

### 4. Access Applications

- **Host Application**: http://localhost:3000 (loads all remotes)
- **Grade Module (Standalone)**: http://localhost:3105
- **Log Sheet Module (Standalone)**: http://localhost:3106
- **AI Vision Module (Standalone)**: http://localhost:3107

## 📚 Available Scripts

### Development

```bash
npm run dev:host        # Start host application
npm run dev:grade       # Start grade remote
npm run dev:logsheet    # Start dynamic log sheet remote
npm run dev:ai-vision   # Start AI vision remote
```

### Build

```bash
npm run build:host      # Build host application
npm run build:grade     # Build grade remote
npm run build:logsheet  # Build dynamic log sheet remote
npm run build:ai-vision # Build AI vision remote
npm run build:all       # Build all remotes + host
npm run build:remotes   # Build all remotes only
```

### Installation

```bash
npm run install:all     # Install dependencies for all apps
npm run install:host    # Install host dependencies only
npm run install:grade   # Install grade remote dependencies only
npm run install:logsheet # Install log sheet remote dependencies only
npm run install:ai-vision # Install AI vision remote dependencies only
```

### Info

```bash
npm run info            # Display all available commands
```

## 🎨 UI Features

### Host Application

- **Modern Navigation Bar** - MUI AppBar with responsive design and mobile drawer
- **Beautiful Home Page** - Gradient text, animated cards with hover effects
- **Redux Counter Demo** - Interactive counter with notifications
- **Notification System** - Toast notifications for actions
- **Responsive Design** - Mobile-friendly with drawer navigation
- **Theme System** - Custom MUI theme with Tailwind utilities
- **Framer Motion** - Smooth animations throughout

### Remote Applications

- **Consistent Theme** - All remotes match host design system
- **Redux Integration** - Access and control host Redux store
- **Beautiful UI** - Modern cards, gradients, and animations
- **Standalone Mode** - Each remote can run independently

## 🔄 Redux Store Integration

The host provides a Redux store with the following slices:

**appSlice** - Application state:

- `theme`: "light" | "dark"
- `currentModule`: string | null
- `notifications`: Array of notification objects
- `user`: User information

**counterSlice** - Demo counter:

- `value`: number
- `history`: number[]

### Using Redux in Remotes

Remotes can access and control the host Redux store:

```typescript
import { useSelector, useDispatch } from "../hooks/useReduxStore";

// Access state
const counter = useSelector((state: any) => state.counter.value);

// Dispatch actions
dispatch({ type: "counter/increment" });
dispatch({
  type: "app/addNotification",
  payload: {
    message: "Hello from remote!",
    type: "success",
  },
});
```

**Example Redux Interactions:**

- **Grade Module**: Increments counter and shows success notification
- **Log Sheet Module**: Decrements counter and shows info notification
- **AI Vision Module**: Increments counter and shows success notification

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

### 📋 Quick Links

- **[Documentation Index](./docs/README.md)** - Overview of all documentation
- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Complete folder structure and organization
- **[Complete Setup Guide](./docs/COMPLETE_SETUP_GUIDE.md)** - Detailed setup and configuration
- **[Enterprise Architecture](./docs/ENTERPRISE_COMPONENT_ARCHITECTURE.md)** - Architecture principles and patterns
- **[Environment Variables Guide](./docs/ENV_FILE_GUIDE.md)** - Environment configuration and priority
- **[Research Templates](./docs/research-templates/)** - Reference implementations and templates
- **[Quick Start Enterprise](./docs/QUICK_START_ENTERPRISE.md)** - Quick reference guide

### 📚 All Documentation Files

See the [docs/README.md](./docs/README.md) for a complete index of all available documentation.

## 🎯 Key Features

### State Management

- ✅ **Redux** - Shared state in host (accessible by all remotes)
- ✅ **Zustand** - Module-specific state in remotes
- ✅ **Local State** - Component-level state with React hooks

### Styling

- ✅ **Tailwind CSS** - Utility-first classes throughout
- ✅ **MUI Components** - Material Design components
- ✅ **CSS Modules** - Component-scoped styles (`.module.css`, `.module.scss`)
- ✅ **Global CSS** - Shared styles in `host/src/styles/globals.css`
- ✅ **Gradients** - Beautiful gradient effects
- ✅ **Animations** - Framer Motion animations and transitions

### UI Components

- ✅ **Navigation** - Responsive AppBar with mobile drawer
- ✅ **Cards** - Feature cards with hover effects
- ✅ **Buttons** - Material-UI buttons with icons
- ✅ **Notifications** - Toast notification system
- ✅ **Progress Indicators** - Loading states and progress bars
- ✅ **Chips** - Status indicators and badges
- ✅ **Typography** - Consistent text styling

## 📦 Shared Dependencies

All applications share these as singletons:

- `react` & `react-dom`
- `react-router-dom`
- `react-redux` & `@reduxjs/toolkit`
- `zustand`
- `@mui/material` & `@mui/icons-material`
- `@emotion/react` & `@emotion/styled`
- `framer-motion`

## 🏭 Production Build

### Build Remotes First

```bash
# Build all remotes
npm run build:remotes

# Or build individually
npm run build:grade
npm run build:logsheet
npm run build:ai-vision
```

### Build Host

```bash
npm run build:host
```

**Or build everything:**

```bash
npm run build:all
```

**Important**: In production builds:

- Remotes have **NO entry point** (entry removed in webpack config)
- Only `App.tsx` is exposed via Module Federation
- Host loads remotes from built `remoteEntry.js` files

## 🐛 Troubleshooting

### Module Federation Errors

**"vision is not defined" or similar errors:**

- Ensure remote servers are running
- Check that `remoteEntry.js` is accessible
- Verify webpack Module Federation configuration

**Shared module errors:**

- Ensure all shared dependencies have compatible versions
- Check that `eager: true` is set for critical dependencies

### TypeScript Errors

**Remote imports:**

- TypeScript warnings for Module Federation imports are expected
- Use `@ts-ignore` for remote imports if needed

**Redux types:**

- Remotes import types from host: `../../../../host/src/store`
- Standalone mode uses mock types from `hooks/useReduxStore`

### Build Errors

1. Ensure all dependencies installed: `npm run install:all`
2. Check TypeScript config (`noEmit: false` in all `tsconfig.json`)
3. Verify webpack configs are correct
4. Check `.env` file exists with correct ports

### Standalone Mode Errors

**Redux context errors:**

- Standalone mode uses mock Redux store from `store/standaloneStore.ts`
- Ensure `dev.tsx` wraps app with Redux Provider

**Zustand errors:**

- Ensure `zustand` is set to `eager: true` in Module Federation config

## 📝 Notes

- **Production builds** exclude dev entries from remotes
- **Assets** organized in `src/assets/` and `public/assets/`
- **CSS extracted** in production builds
- **SCSS/SASS modules** supported
- **Tailwind CSS** configured globally
- **Redux store** shared and accessible from all remotes
- **Beautiful, responsive UI** with MUI and Tailwind
- **Framer Motion** animations throughout

## 🎯 Testing Redux Integration

1. Navigate to host home page (http://localhost:3000)
2. Use the counter buttons to increment/decrement
3. Navigate to any remote module (Grade, Log Sheet, AI Vision)
4. See the same counter value displayed
5. Click action buttons in remotes to modify counter
6. Counter updates and shows notification
7. Navigate back to home - counter value persists

This demonstrates that remotes can:

- ✅ Read from host Redux store
- ✅ Dispatch actions to host Redux store
- ✅ Trigger notifications in host
- ✅ Share state across all modules

## 🔗 Additional Resources

- **Research Templates**: See [`docs/research-templates/`](./docs/research-templates/) for reference implementations
- **Documentation**: See [`docs/`](./docs/) for comprehensive guides
- **Configuration**: See [`shared/`](./shared/) for webpack and build configs

---

**Built with ❤️ using Webpack Module Federation, React, Redux, MUI, Tailwind CSS, and Framer Motion**
