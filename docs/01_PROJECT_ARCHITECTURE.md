# Discovery Hub Project Architecture

Discovery Hub is a learning-focused micro-frontend platform that demonstrates how multiple React applications can be developed, built, deployed, and loaded independently while still behaving like one product.

## Project Purpose

The project exists to explore production-oriented micro-frontend patterns with Webpack 5 Module Federation.

It demonstrates:

- one host application that owns the main application shell;
- multiple independently deployable remote applications;
- runtime loading of remote bundles;
- shared routing, state, theme, and UI context;
- standalone development for every remote;
- separate production deployments without rebuilding the host for every remote release.

## Application Topology

```text
Browser
  |
  v
Host application
  |- React root
  |- BrowserRouter
  |- Redux Provider
  |- MUI ThemeProvider
  |- navigation
  |- notifications
  |- remote loading
  |
  |- /cosmos/* ---> Cosmos remote
  |- /atlas/* ----> Atlas remote
  `- /vault/* ----> Vault remote
```

| Application | Route | Port | Responsibility |
| --- | --- | ---: | --- |
| Host | `/` | `3000` | Shell, routing, shared state, theme, navigation, notifications, error boundaries |
| Cosmos | `/cosmos/*` | `3105` | NASA Astronomy Picture of the Day exploration |
| Atlas | `/atlas/*` | `3106` | Open Library book discovery and USGS earthquake exploration |
| Vault | `/vault/*` | `3107` | Precious-metal prices, conversion, karat pricing, and history |

## Repository Structure

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

## Host Responsibilities

The host is responsible for cross-application concerns that should remain consistent across the product.

These include:

- creating the main React root;
- creating the main `BrowserRouter`;
- providing the Redux store;
- providing the MUI theme;
- rendering navigation and global notifications;
- defining top-level remote routes;
- lazy-loading remotes;
- handling remote loading failures;
- preserving theme selection in local storage.

The host should not contain remote-specific business logic.

## Remote Responsibilities

Each remote owns one product domain and exposes its root application component through Module Federation.

```js
exposes: {
  "./App": "./src/App.tsx",
}
```

A remote should own:

- domain-specific pages;
- nested routes below its host route;
- local components;
- domain API calls;
- module-specific Zustand state when required;
- local styling and assets.

A remote should not create another production `BrowserRouter` when rendered by the host.

## Single Root and Single Router Pattern

The integrated application follows a single-root pattern.

```text
Host createRoot
  `- Redux Provider
      `- BrowserRouter
          `- Host App
              `- Remote React component
```

This prevents:

- duplicate React trees;
- broken React context;
- nested router errors;
- independent navigation histories;
- duplicated global stores;
- inconsistent application themes.

Each remote still has a development entry such as `src/dev.tsx` so it can create its own root and router while running independently.

## Shared Context Flow

Because the host renders a remote as a React component, normal React context propagation applies.

The remote can receive:

- router context from `BrowserRouter`;
- Redux context from `Provider`;
- MUI theme context from `ThemeProvider`;
- error-boundary behavior from the host;
- suspense loading behavior from the host.

No custom mount API is necessary for the current architecture.

## Shared Dependency Strategy

Critical libraries are configured as singleton shared dependencies.

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

Singleton sharing is essential because multiple copies of React or router packages can break hooks and context identity.

## Architectural Boundaries

A healthy boundary follows these rules:

- the host owns global product behavior;
- remotes own domain behavior;
- remotes do not import source code from one another;
- integration occurs through Module Federation or explicit shared contracts;
- environment variables define deployment locations;
- every remote remains independently buildable;
- shared libraries stay version-compatible.

## Adding a New Remote

A new remote requires these steps:

1. Create a folder under `remotes/`.
2. Add `src/App.tsx` and `src/dev.tsx`.
3. Expose `./App` through Module Federation.
4. Add root scripts to `package.json`.
5. Add a route and lazy import in the host.
6. Add a remote URL environment variable.
7. Add the remote to the runtime loader URL map.
8. Deploy the remote separately.
9. Verify `remoteEntry.js` and async chunks are publicly reachable.

## Common Architectural Mistakes

- Creating a second `BrowserRouter` inside a hosted remote.
- Loading another copy of React.
- Putting domain-specific code in the host.
- Hardcoding local remote URLs in source code.
- Sharing every dependency without evaluating coupling.
- Assuming standalone and hosted execution are identical.
- Using a relative production URL that points back to the host deployment.

## Best Practices

- Keep remote entry contracts small.
- Expose application components rather than internal files.
- Keep top-level routing in the host.
- Keep nested routing inside each remote.
- Treat remote URLs as deployment configuration.
- Add error boundaries around every remote.
- Keep compatible shared-package versions.
- Test both standalone and hosted modes.
- Deploy remotes before deploying a host configuration that references them.

## Summary

Discovery Hub uses a component-based micro-frontend architecture. The host owns the shared runtime shell, while Cosmos, Atlas, and Vault remain independently developed and deployed applications. Webpack Module Federation connects them at runtime without sacrificing normal React context behavior.