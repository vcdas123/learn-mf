# Routing, State Management, and the Shared UI Shell

Discovery Hub integrates independently built remote applications into one React experience. This note explains how routing, Redux, Zustand, theming, navigation, notifications, suspense, and error boundaries work together.

## Host Application Shell

The host is the common frame around every remote.

It provides:

- the application-level React root;
- `BrowserRouter` and top-level routes;
- the Redux store;
- Material UI theme context;
- global CSS;
- navigation;
- notifications;
- loading indicators;
- remote error boundaries.

The host shell remains mounted while users move between the home page and remote routes.

## Top-Level Route Configuration

Remote routes are declared as data rather than repeated route markup.

```ts
export const remoteRoutes = [
  {
    path: "/cosmos",
    label: "Cosmos",
    moduleName: "cosmos",
    routePath: "/cosmos/*",
  },
  {
    path: "/atlas",
    label: "Atlas",
    moduleName: "atlas",
    routePath: "/atlas/*",
  },
  {
    path: "/vault",
    label: "Vault",
    moduleName: "vault",
    routePath: "/vault/*",
  },
];
```

The wildcard is important because each remote may define nested routes below its assigned base path.

## Host Route Rendering

The host maps route metadata to lazy remote components.

```tsx
<Routes location={location} key={location.pathname}>
  <Route path="/" element={<HomePage />} />
  {remoteRoutes.map(route => {
    const RemoteComponent = remoteComponentMap[route.moduleName];

    return (
      <Route
        key={route.routePath}
        path={route.routePath}
        element={
          <RemoteErrorBoundary moduleName={route.moduleName}>
            <Suspense fallback={<RemoteLoading moduleName={route.moduleName} />}>
              <RemoteComponent />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />
    );
  })}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

The host owns only the remote's base route. Nested domain routes remain inside the remote.

## Router Ownership

The integrated application must have one primary `BrowserRouter`.

```text
BrowserRouter in host
  |- /
  |- /cosmos/*
  |- /atlas/*
  `- /vault/*
```

A hosted remote can use `Routes`, `Route`, `Link`, `Navigate`, `useLocation`, and `useNavigate` because it inherits router context from the host.

It must not wrap its exported application component in another `BrowserRouter`.

## Standalone Routing

A remote still needs a router when launched directly on its development port. That router belongs in `src/dev.tsx`, not in the federated `App.tsx` contract.

```tsx
createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

This separation keeps hosted and standalone execution compatible.

## Redux Ownership

The host creates and provides the shared Redux store.

```text
Provider
  `- Host App
      `- Remote App
```

Because the remote renders below the same provider, it can use `useSelector` and `useDispatch` against the host store when it imports compatible shared store contracts.

Global Redux is appropriate for state that must be coordinated across the shell and remotes, such as:

- application theme;
- global notifications;
- authenticated user information;
- global feature flags;
- shared counters or demonstration state.

## Zustand Ownership

Zustand is useful for state that belongs only to one remote.

Examples include:

- Cosmos search and view preferences;
- Atlas book or earthquake filters;
- Vault conversion inputs and local pricing selections.

This avoids growing the global Redux store with state that no other application needs.

## Choosing State Location

| State type | Recommended owner |
| --- | --- |
| Component-only form state | React component state |
| Remote-specific reusable state | Remote Zustand store |
| Cross-remote application state | Host Redux store |
| Server response cache | Domain data layer or query cache |
| URL-driven filters | Router search parameters |
| Persistent theme preference | Redux plus local storage |

The narrowest valid owner should hold the state.

## Theme System

The host reads the theme mode from Redux and creates the MUI theme.

```ts
const mode = useSelector((state: RootState) => state.app.theme);
const theme = useMemo(() => getTheme(mode), [mode]);
```

The selected mode is also written to the document root.

```ts
document.documentElement.setAttribute("data-theme", mode);
```

This allows MUI, Tailwind-compatible CSS variables, and custom global styles to respond to the same mode.

## Theme Initialization

On startup, the host checks local storage.

- If `app-theme` exists, that value is restored.
- Otherwise, the browser's `prefers-color-scheme` setting determines the initial mode.

This produces a stable preference while still respecting the operating system for first-time visitors.

## Navigation

Navigation is generated from the same remote route metadata used by the router.

That reduces drift between:

- visible menu items;
- route paths;
- remote names;
- home-page feature cards.

A new remote should be added through centralized configuration rather than hardcoded separately in multiple components.

## Loading States

`React.lazy` suspends while the remote entry and exposed module are loading. `RemoteLoading` provides feedback during that period.

A useful loading state should:

- identify the module being loaded;
- preserve the shell layout;
- avoid blocking unrelated navigation;
- remain visually consistent with the active theme.

## Error Boundaries

A remote error boundary isolates failures to one domain.

It can catch:

- a rejected remote-loading promise;
- a missing federation container;
- a missing exposed module;
- a render-time exception inside the remote.

Without an error boundary, one broken remote could blank the whole integrated application.

## Route Transitions

The host uses Framer Motion's `AnimatePresence` around route content.

```tsx
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* routes */}
  </Routes>
</AnimatePresence>
```

The route key causes the old route content to exit before the new route content completes its entrance animation.

## Common Problems

### Nested Router Error

Cause: a remote's exported `App` creates another `BrowserRouter`.

Fix: move the standalone router into `src/dev.tsx`.

### Redux Context Missing

Cause: the remote runs standalone without a development provider, or different React Redux copies are loaded.

Fix: add a standalone provider and keep `react-redux` shared as a singleton.

### Theme Mismatch

Cause: the remote creates an unrelated theme or loads incompatible Emotion instances.

Fix: inherit the host theme where possible and share MUI and Emotion as singletons.

### Direct Nested Route Refresh Fails

Cause: the deployment server does not rewrite SPA routes to `index.html`.

Fix: configure host and standalone remote rewrites.

## Best Practices

- Keep global providers in the host.
- Keep remote domain providers inside the remote only when truly local.
- Use URL state for shareable navigation state.
- Use Redux only for genuine cross-application state.
- Keep standalone wrappers outside the federated component.
- Generate navigation and routes from shared metadata.
- Wrap every remote with suspense and an error boundary.
- Test direct URL entry and browser refresh behavior.

## Summary

Discovery Hub behaves as one application because the host owns the shared shell and contexts. Remotes inherit routing, Redux, and theme behavior when integrated, while development-only entry files provide the wrappers required for standalone work.