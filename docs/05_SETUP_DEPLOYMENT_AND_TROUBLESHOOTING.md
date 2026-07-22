# Setup, Deployment, and Troubleshooting

This note explains how to install, configure, run, build, deploy, verify, and troubleshoot the Discovery Hub micro-frontend platform.

## Prerequisites

Use:

- Node.js `16` or newer;
- npm `8` or newer;
- a modern browser;
- four available local ports;
- network access to the public APIs used by the remotes.

Keep Node.js and npm versions consistent across the host and remotes.

## Installation

Install every application from the repository root.

```bash
npm run install:all
```

The script installs dependencies for:

- the root project;
- `host`;
- `remotes/cosmos`;
- `remotes/atlas`;
- `remotes/vault`.

Individual installation commands are also available.

```bash
npm run install:host
npm run install:cosmos
npm run install:atlas
npm run install:vault
```

## Environment Configuration

Create a root `.env` file.

```env
HOST_PORT=3000
REMOTE_COSMOS_PORT=3105
REMOTE_ATLAS_PORT=3106
REMOTE_VAULT_PORT=3107

REMOTE_COSMOS_URL=http://localhost:3105
REMOTE_ATLAS_URL=http://localhost:3106
REMOTE_VAULT_URL=http://localhost:3107

REACT_APP_NASA_API_KEY=DEMO_KEY
REACT_APP_GOLDAPI_KEY=
```

The host variables point to remote base URLs. The remote port variables control local development servers.

## Environment Variable Rules

- Use full remote origins in production.
- Do not use host-relative routes such as `/cosmos`.
- A trailing slash is normalized by the loader.
- A value ending in `/remoteEntry.js` is also normalized.
- Frontend environment variables are visible in browser JavaScript.
- Do not store private server-side secrets in these variables.

## Local Development

Run all four applications in separate terminals.

```bash
npm run dev:host
```

```bash
npm run dev:cosmos
```

```bash
npm run dev:atlas
```

```bash
npm run dev:vault
```

Open:

| Application | URL |
| --- | --- |
| Host | `http://localhost:3000` |
| Cosmos standalone | `http://localhost:3105` |
| Atlas standalone | `http://localhost:3106` |
| Vault standalone | `http://localhost:3107` |

## Development Verification

Verify each remote independently before testing the host.

1. Open the standalone remote URL.
2. Confirm its main page renders.
3. Confirm browser console errors are absent.
4. Open `/remoteEntry.js` directly.
5. Start the host.
6. Navigate to the matching host route.
7. Confirm the remote renders inside the host shell.
8. Refresh the browser on the remote route.

## Production Build

Build every remote and the host.

```bash
npm run build:all
```

The root script builds in this order:

1. Cosmos;
2. Atlas;
3. Vault;
4. Host.

You can build only the remotes.

```bash
npm run build:remotes
```

Or build one application.

```bash
npm run build:host
npm run build:cosmos
npm run build:atlas
npm run build:vault
```

## Serving Production Output Locally

Build first, then use the start scripts.

```bash
npm run start:host
npm run start:cosmos
npm run start:atlas
npm run start:vault
```

The scripts serve each application's `dist` directory on its configured default production-preview port.

## Deployment Model

Deploy four independent applications:

```text
Host deployment
Cosmos deployment
Atlas deployment
Vault deployment
```

The recommended order is:

1. deploy Cosmos;
2. deploy Atlas;
3. deploy Vault;
4. verify every remote entry;
5. configure the three URLs in the host deployment;
6. deploy the host.

## Remote Deployment Requirements

Every remote deployment must serve:

- `index.html` for standalone access;
- `remoteEntry.js` for federation;
- generated JavaScript chunks;
- generated CSS;
- public assets.

The browser must be allowed to request remote files from the host origin. Configure CORS headers when the deployment platform does not already permit this.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

For a public learning project, `*` is convenient. A production enterprise system should restrict origins according to its security model.

## SPA Rewrites

The host and standalone remotes need SPA fallback behavior.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Be careful not to rewrite real assets such as `remoteEntry.js` or generated chunks to `index.html`. A deployment that returns HTML for JavaScript URLs causes syntax and federation loading errors.

## Host Production Variables

Configure these in the host deployment platform.

```text
REMOTE_COSMOS_URL=https://your-cosmos-domain.example
REMOTE_ATLAS_URL=https://your-atlas-domain.example
REMOTE_VAULT_URL=https://your-vault-domain.example
```

The current runtime loader also contains deployed fallback URLs. Explicit environment variables are still preferred because they make deployment intent clear.

## Deployment Verification Checklist

For each remote:

```text
https://remote-domain.example/
https://remote-domain.example/remoteEntry.js
```

Verify:

- both URLs return successful responses;
- `remoteEntry.js` returns JavaScript, not HTML;
- async chunks load from the remote origin;
- CORS does not block the request;
- the container name matches the runtime name;
- nested standalone routes refresh correctly.

For the host:

- open the home page;
- navigate to every remote;
- refresh on every remote route;
- test light and dark themes;
- inspect the browser network panel;
- confirm no duplicate React warning appears.

## Troubleshooting Remote Loading

### Failed to Load Remote Entry

Check the exact generated URL in the network panel.

Expected pattern:

```text
https://remote-domain.example/remoteEntry.js
```

Common causes:

- remote server is not running;
- environment URL is wrong;
- deployment failed;
- CORS blocked the script;
- SPA rewrite returned `index.html`;
- DNS or network connectivity failed.

### Remote Container Not Found

The script loaded, but `window[remoteName]` is missing.

Check that Module Federation uses the same name expected by the host.

```js
getRemoteConfig("cosmos")
```

must correspond to:

```ts
loadRemoteModule("cosmos", "./App")
```

### Exposed Module Not Found

Check the expose key.

```js
exposes: {
  "./App": "./src/App.tsx",
}
```

The host must request exactly `./App`.

### Invalid Hook Call

This usually means multiple React copies were loaded.

Check:

- compatible React versions;
- `singleton: true` for React and React DOM;
- duplicate lockfile resolutions;
- remote bundling configuration.

### Router Context Error

A hosted remote may be creating another `BrowserRouter`, or a standalone remote may be missing its development router.

Keep the hosted `App.tsx` router-free and place standalone wrappers in `src/dev.tsx`.

### Remote Chunk 404

The entry loaded, but an async chunk was requested from the wrong origin.

Keep:

```js
publicPath: "auto"
```

Also confirm that all generated files were deployed.

### Hard Refresh Returns 404

Configure an SPA rewrite for host routes. The server must return `index.html` for application routes while still serving actual assets normally.

### Environment Variable Is Undefined

Check:

- the root `.env` file location;
- the variable name;
- the relevant `DefinePlugin` mapping;
- whether the application was rebuilt after changing the variable;
- deployment environment configuration.

## Clean Build Recovery

When dependency or output state appears stale:

```bash
npm run clean
rm -rf node_modules host/node_modules remotes/cosmos/node_modules remotes/atlas/node_modules remotes/vault/node_modules
npm run install:all
npm run build:all
```

The project clean commands use Unix shell syntax. Run them through macOS, Linux, Git Bash, or WSL.

## Operational Best Practices

- Deploy remotes before the host references them.
- Use immutable remote deployment URLs when strict release control is required.
- Add health checks for `remoteEntry.js`.
- Log remote-loading errors with the remote name and resolved URL.
- Keep rollback URLs available.
- Test cross-origin behavior in a production-like environment.
- Avoid incompatible breaking changes to exposed modules.
- Monitor public API rate limits and failures separately from federation failures.

## Summary

Reliable micro-frontend deployment depends on more than a successful Webpack build. Remote entries, async chunks, CORS, SPA rewrites, environment URLs, share scopes, and package compatibility must all align. Discovery Hub's runtime loader and independent deployment model make these responsibilities explicit.