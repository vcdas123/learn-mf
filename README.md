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
│   ├── student-grades/     # Student Grades module (Zustand store)
│   ├── activity-log/       # Activity Log module
│   └── image-analyzer/      # Image Analyzer module
├── sharedConfigs/          # Shared webpack configs
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
npm run install:student-grades
npm run install:activity-log
npm run install:image-analyzer
```

### 2. Configure Environment

The `.env` file should already exist with default ports. You can modify it if needed:

```bash
HOST_PORT=3000
REMOTE_STUDENT_GRADES_PORT=3105
REMOTE_ACTIVITY_LOG_PORT=3106
REMOTE_IMAGE_ANALYZER_PORT=3107
```

### 3. Start Development Servers

**Using Root Package.json Scripts (Recommended)**

Start each application using the convenient root-level scripts:

```bash
# Terminal 1: Host
npm run dev:host

# Terminal 2: Student Grades Remote
npm run dev:student-grades

# Terminal 3: Activity Log Remote
npm run dev:activity-log

# Terminal 4: Image Analyzer Remote
npm run dev:image-analyzer
```

**Or manually:**

```bash
cd host && npm run dev
cd remotes/student-grades && npm run dev
cd remotes/activity-log && npm run dev
cd remotes/image-analyzer && npm run dev
```

### 4. Access Applications

- **Host Application**: http://localhost:3000 (loads all remotes)
- **Student Grades Module (Standalone)**: http://localhost:3105
- **Activity Log Module (Standalone)**: http://localhost:3106
- **Image Analyzer Module (Standalone)**: http://localhost:3107

## 📚 Available Scripts

### Development

```bash
npm run dev:host              # Start host application
npm run dev:student-grades    # Start student-grades remote
npm run dev:activity-log      # Start activity-log remote
npm run dev:image-analyzer    # Start image-analyzer remote
```

### Build

```bash
npm run build:host            # Build host application
npm run build:student-grades  # Build student-grades remote
npm run build:activity-log    # Build activity-log remote
npm run build:image-analyzer  # Build image-analyzer remote
npm run build:all             # Build all remotes + host
npm run build:remotes         # Build all remotes only
```

### Installation

```bash
npm run install:all           # Install dependencies for all apps
npm run install:host          # Install host dependencies only
npm run install:student-grades # Install student-grades remote dependencies only
npm run install:activity-log   # Install activity-log remote dependencies only
npm run install:image-analyzer # Install image-analyzer remote dependencies only
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

## 📚 Knowledge Center (Master Documentation Index)

This project is extensively documented to serve as a reference for enterprise micro-frontend architecture. Use this section as your primary index for all "notes" and technical guides.

### 🏁 Getting Started & Setup
- **[Complete Setup Guide](./docs/COMPLETE_SETUP_GUIDE.md)** - Master guide for environment, webpack, and state management.
- **[Environment Variables Guide](./docs/ENV_FILE_GUIDE.md)** - Understanding `.env` priority and configuration.
- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Complete breakdown of the repository organization.
- **[Demo Setup](./docs/DEMO_SETUP.md)** - How to run and test the provided demo scenarios.
- **[Quick Start Enterprise](./docs/QUICK_START_ENTERPRISE.md)** - "DOs and DON'Ts" and enterprise patterns.

### 🏗️ Architecture & Core Principles
- **[Enterprise Architecture](./docs/ENTERPRISE_COMPONENT_ARCHITECTURE.md)** - Single root, single router, and pure component patterns.
- **[Execution Flow](./docs/EXECUTION_FLOW.md)** - Step-by-step breakdown of Standalone vs. Host modes.
- **[Module Federation Eager Loading](./docs/MODULE_FEDERATION_EAGER_LOADING.md)** - Dependency sharing and `eager: true` configuration.
- **[Webpack Public Path](./docs/WEBPACK_PUBLIC_PATH.md)** - How dynamic loading works with `publicPath: "auto"`.

### 🛠️ Technical Deep Dives
- **[CSS Handling Guide](./docs/CSS_HANDLING_GUIDE.md)** - Integrating Tailwind, MUI, and CSS Modules.
- **[Tailwind & PostCSS Config](./docs/TAILWIND_POSTCSS_CONFIG.md)** - Deep dive into shared styling configuration.
- **[Asset Structure](./docs/ASSET_STRUCTURE.md)** - Guidelines for images, fonts, and favicons.
- **[Bundle Size Optimization](./docs/WEBPACK_BUNDLE_SIZE_WARNINGS.md)** - Managing and optimizing build outputs.
- **[Research Templates](./docs/research-templates/README.md)** - Reference implementations for host and remotes.

### 🚀 Deployment
- **[Vercel Deployment Guide](./docs/VERCEL_DEPLOYMENT_GUIDE.md)** - Production setup, CORS, and deployment workflows.

---

## 🎯 Key Features & Capabilities

### State Management
- ✅ **Shared Redux** - Host store is naturally accessible by all remotes.
- ✅ **Zustand Support** - Remotes can use module-specific state.
- ✅ **Local State** - Standard React hooks usage across all components.

### Styling & UI
- ✅ **Unified Tailwind** - Utility-first classes shared across the ecosystem.
- ✅ **MUI Integration** - Enterprise-grade component library.
- ✅ **Framer Motion** - Smooth, coordinated animations between modules.
- ✅ **CSS Isolation** - CSS Modules used where scoping is required.

### UI Components
- ✅ **Responsive Navigation** - Shared AppBar with mobile drawer support.
- ✅ **Notification System** - Global toast notifications triggered from any remote.
- ✅ **Architecture Info** - Built-in documentation and diagrams within the UI.

---

## 🏭 Production Build & Deployment

### Build Workflow
```bash
# 1. Build all remotes (remotes have NO entry point in production)
npm run build:remotes

# 2. Build host (loads remotes via remoteEntry.js)
npm run build:host

# OR build everything at once
npm run build:all
```

### 🌐 Production Environment Variables
Set these in your CI/CD or production platform (Vercel, AWS, etc.):

| Variable | Description |
|----------|-------------|
| `REMOTE_STUDENT_GRADES_URL` | Base URL for Student Grades remote |
| `REMOTE_ACTIVITY_LOG_URL` | Base URL for Activity Log remote |
| `REMOTE_IMAGE_ANALYZER_URL` | Base URL for Image Analyzer remote |

---

## 🧪 Verification: Testing Redux Integration

1.  **Home Page**: Navigate to [http://localhost:3000](http://localhost:3000).
2.  **Host Action**: Use the counter buttons to increment/decrement state.
3.  **Remote Switch**: Navigate to any remote module (e.g., Student Grades).
4.  **Shared State**: Observe the same counter value in the remote.
5.  **Remote Action**: Click action buttons in the remote to update the host store.
6.  **Confirmation**: Verify notifications and state updates reflect globally.

---

## 🐛 Troubleshooting Quick-Ref

- **"vision is not defined"**: Ensure all remote servers are running and `remoteEntry.js` is accessible.
- **Shared Module Errors**: Check `MODULE_FEDERATION_EAGER_LOADING.md` for version compatibility.
- **TypeScript Warnings**: Expected for remote imports; see `COMPLETE_SETUP_GUIDE.md`.
- **Build Failures**: Run `npm run install:all` to ensure all peer dependencies are met.

---

**Built with ❤️ using Webpack Module Federation, React, Redux, MUI, Tailwind CSS, and Framer Motion**

