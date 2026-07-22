# Discovery Hub

Discovery Hub is a learning-focused micro-frontend platform built with React, TypeScript, Webpack 5 Module Federation, Redux Toolkit, Zustand, Material UI, Tailwind CSS, and Framer Motion.

The host application provides the shared application shell, router, Redux store, theme, navigation, notifications, loading states, and error boundaries. Three independently deployable remotes are loaded at runtime only when their routes are visited:

- **Cosmos** — NASA Astronomy Picture of the Day explorer
- **Atlas** — book discovery and earthquake activity explorer
- **Vault** — precious-metal prices, converters, and historical pricing tools

## Architecture

```text
Browser
  |
  v
Host application (:3000)
  |- React root
  |- BrowserRouter
  |- Redux Provider
  |- MUI ThemeProvider
  |- Navigation and notifications
  |- /cosmos/* ----> Cosmos remote (:3105)
  |- /atlas/* -----> Atlas remote (:3106)
  `- /vault/* -----> Vault remote (:3107)
```

### Core principles

- The host owns the primary React root and `BrowserRouter`.
- Remotes expose `./App` as React components through Module Federation.
- Remote applications can run independently through their development entry points.
- The host loads each remote's `remoteEntry.js` dynamically when its route is accessed.
- Failed remote loads are retried and rendered through a remote-specific error boundary.
- Shared libraries are configured as singleton dependencies to avoid duplicate React, router, Redux, Zustand, MUI, and Emotion instances.
- The host Redux store and router context naturally flow into federated components.
- Remote URLs can be configured through environment variables without rebuilding the Module Federation configuration.

## Applications

| Application | Route | Default port | Purpose |
| --- | --- | ---: | --- |
| Host | `/` | `3000` | Shared shell, navigation, routing, theme, notifications, and remote loading |
| Cosmos | `/cosmos/*` | `3105` | NASA Astronomy Picture of the Day explorer |
| Atlas | `/atlas/*` | `3106` | Open Library book discovery and USGS earthquake exploration |
| Vault | `/vault/*` | `3107` | Gold, silver, and copper pricing tools |

## Technology stack

- React 18
- TypeScript 5
- Webpack 5
- Webpack Module Federation
- React Router 6
- Redux Toolkit and React Redux
- Zustand
- Material UI and Emotion
- Tailwind CSS and PostCSS
- Framer Motion

## Repository structure

```text
learn-mf/
|- host/
|  |- public/
|  |- src/
|  |  |- components/
|  |  |- routes/
|  |  |- store/
|  |  |- styles/
|  |  |- utils/
|  |  |- App.tsx
|  |  `- index.tsx
|  |- package.json
|  `- webpack.config.js
|- remotes/
|  |- cosmos/
|  |- atlas/
|  `- vault/
|- sharedConfigs/
|  |- webpack.common.js
|  |- webpack.module-federation.js
|  |- postcss.config.js
|  `- tailwind.config.js
|- docs/
|- package.json
`- README.md
```

Each remote exposes the following federated module:

```js
exposes: {
  "./App": "./src/App.tsx",
}
```

## Prerequisites

- Node.js 16 or newer
- npm 8 or newer

Use the same Node.js and npm versions across the host and all remotes when possible.

## Installation

Install every application from the repository root:

```bash
npm run install:all
```

To install only one application:

```bash
npm run install:host
npm run install:cosmos
npm run install:atlas
npm run install:vault
```

## Environment configuration

Create a `.env` file in the repository root.

```env
# Development ports
HOST_PORT=3000
REMOTE_COSMOS_PORT=3105
REMOTE_ATLAS_PORT=3106
REMOTE_VAULT_PORT=3107

# Remote base URLs used by the host
REMOTE_COSMOS_URL=http://localhost:3105
REMOTE_ATLAS_URL=http://localhost:3106
REMOTE_VAULT_URL=http://localhost:3107

# Optional API credentials
# Cosmos falls back to NASA's DEMO_KEY when this is omitted.
REACT_APP_NASA_API_KEY=DEMO_KEY

# Required for Vault API requests that need authentication.
REACT_APP_GOLDAPI_KEY=
```

Remote URL values should be base URLs. Supplying `/remoteEntry.js` is also tolerated because the loader normalizes the configured value before constructing the final URL.

When no remote URL is supplied, the host currently falls back to these deployed remotes:

```text
Cosmos: https://cosmos-xi-one.vercel.app
Atlas:  https://atlas-xi-one.vercel.app
Vault:  https://vault-xi-one.vercel.app
```

Do not configure a production remote URL as a relative host route such as `/cosmos`. Each remote must point to the deployment that serves its own `remoteEntry.js`.

## Running locally

All four development servers must be running when testing the complete host experience.

```bash
# Terminal 1
npm run dev:host

# Terminal 2
npm run dev:cosmos

# Terminal 3
npm run dev:atlas

# Terminal 4
npm run dev:vault
```

Open:

- Host: `http://localhost:3000`
- Cosmos standalone: `http://localhost:3105`
- Atlas standalone: `http://localhost:3106`
- Vault standalone: `http://localhost:3107`

The standalone remote builds use `src/dev.tsx` as their entry point. When loaded by the host, Module Federation consumes the remote's exposed `src/App.tsx` component instead.

## Available scripts

### Development

```bash
npm run dev:host
npm run dev:cosmos
npm run dev:atlas
npm run dev:vault
```

### Production builds

```bash
npm run build:host
npm run build:cosmos
npm run build:atlas
npm run build:vault
npm run build:remotes
npm run build:all
```

`build:all` builds Cosmos, Atlas, and Vault first, then builds the host.

### Serve production builds locally

Run these commands only after building the corresponding application:

```bash
npm run start:host
npm run start:cosmos
npm run start:atlas
npm run start:vault
```

### Clean generated output

```bash
npm run clean
npm run clean:host
npm run clean:cosmos
npm run clean:atlas
npm run clean:vault
```

The clean scripts use Unix-style `rm -rf`, so they work directly on macOS and Linux. On Windows, run them through Git Bash/WSL or remove the `dist` directories manually.

## Runtime remote loading

The host does not declare static remotes inside `ModuleFederationPlugin`. Instead, it performs runtime loading:

1. A user navigates to `/cosmos`, `/atlas`, or `/vault`.
2. React lazily requests the matching remote module.
3. The host resolves the remote URL from its environment configuration.
4. A script element loads the remote's `remoteEntry.js`.
5. The remote container initializes against Webpack's default shared scope.
6. The host requests the exposed `./App` module.
7. The remote component renders inside the host's existing router, Redux, and theme context.

Loaded remote entries and containers are cached. Retryable network and script-loading failures are retried up to five times before the error boundary displays a failure state.

## Shared dependencies

The shared Module Federation configuration marks these packages as eager singleton dependencies:

- `react`
- `react-dom`
- `react-router-dom`
- `react-redux`
- `@reduxjs/toolkit`
- `zustand`
- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`

Keep compatible versions of these packages across all applications. Version drift can cause invalid hook calls, missing router context, duplicated stores, or inconsistent styling.

## Routing and application shell

The host owns these top-level routes:

```text
/           Host home page
/cosmos/*   Cosmos remote
/atlas/*    Atlas remote
/vault/*    Vault remote
```

Unknown paths redirect to `/`.

The host also owns:

- light and dark theme selection;
- persistence of the selected theme in `localStorage`;
- responsive navigation;
- loading UI while a remote downloads;
- remote error handling;
- global notifications.

## Production deployment

Deploy the host and each remote independently.

Every remote deployment must serve:

```text
/remoteEntry.js
```

Configure the host deployment with the remote base URLs:

```env
REMOTE_COSMOS_URL=https://your-cosmos-domain.example
REMOTE_ATLAS_URL=https://your-atlas-domain.example
REMOTE_VAULT_URL=https://your-vault-domain.example
```

The projects use `publicPath: "auto"`, allowing Webpack to resolve chunks relative to the script that loaded them. Development servers also return permissive CORS headers so the host can load remote assets from different localhost ports.

A typical deployment order is:

```bash
npm run build:remotes
npm run build:host
```

Deploy the remote `dist` directories first, configure their URLs for the host environment, and then deploy the host `dist` directory.

## Troubleshooting

### A remote page fails to load

Confirm that the remote server or deployment is available and that this URL returns JavaScript:

```text
<remote-base-url>/remoteEntry.js
```

Also confirm that the configured URL points to the remote deployment rather than the host route.

### Remote container not found on `window`

The container name must match the Module Federation remote name:

```text
cosmos
atlas
vault
```

### Invalid hook call or router-context errors

Check that React, React DOM, React Router, Redux, MUI, and Emotion versions remain compatible across the host and remotes. These packages rely on singleton sharing.

### API data does not load

- Cosmos uses `REACT_APP_NASA_API_KEY` and defaults to `DEMO_KEY`.
- Vault reads `REACT_APP_GOLDAPI_KEY`.
- Restart the affected development server after changing `.env`.

### A production route works through navigation but fails after refresh

Ensure the hosting platform rewrites application routes to `index.html`. Also verify that remote environment variables contain absolute remote deployment URLs rather than relative host paths.

## Documentation

Additional architecture and setup notes are available in the [`docs`](./docs) directory. Some documents are historical learning notes, so treat the source code and this README as the current reference whenever an older note describes removed remotes or scripts.

## Purpose

This repository is an architecture-learning project for exploring practical micro-frontend concerns, including:

- host and remote boundaries;
- standalone remote development;
- runtime remote discovery;
- dependency sharing;
- cross-application router and state context;
- independent builds and deployments;
- remote loading failures;
- environment-specific remote URLs.
