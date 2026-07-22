# Build System, Styling, and Asset Handling

Discovery Hub uses shared Webpack configuration to keep the host and all remotes consistent while allowing each application to build independently.

## Build Toolchain

The main toolchain includes:

- Webpack 5;
- Webpack Dev Server;
- TypeScript;
- Babel;
- Module Federation;
- CSS Loader and Style Loader;
- Mini CSS Extract Plugin;
- Sass Loader;
- PostCSS;
- Tailwind CSS;
- Material UI and Emotion;
- Copy Webpack Plugin.

## Shared Webpack Configuration

Reusable configuration lives under `sharedConfigs/`.

```text
sharedConfigs/
|- webpack.common.js
|- webpack.module-federation.js
|- postcss.config.js
`- tailwind.config.js
```

Application-level Webpack files merge the shared configuration with their own entry point, port, environment variables, federation role, and output directory.

## Host Build

The host uses `src/index.tsx` as its entry and produces an HTML application.

```js
entry: "./src/index.tsx"
```

The host configuration also:

- creates `index.html`;
- copies public assets;
- injects remote URL environment variables;
- enables SPA fallback in development;
- uses runtime remote loading;
- writes output to `host/dist`.

## Remote Build

Each remote uses `src/dev.tsx` as its normal Webpack entry so the built deployment can also run independently.

```js
entry: "./src/dev.tsx"
```

Module Federation separately exposes `src/App.tsx` through `remoteEntry.js`.

This means one remote build supports both:

- direct standalone access;
- host consumption through federation.

## Development and Production Output

Development uses readable filenames and fast source maps.

```js
filename: "[name].bundle.js"
devtool: "eval-source-map"
```

Production uses content hashes and hidden source maps.

```js
filename: "[name].[contenthash:8].js"
chunkFilename: "[name].[contenthash:8].chunk.js"
devtool: "hidden-source-map"
```

Content hashing supports long-term caching because changed content receives a new URL.

## Public Path

Every application uses:

```js
output: {
  publicPath: "auto",
}
```

`auto` lets Webpack derive the correct base URL for async chunks from the currently executing bundle. This is necessary when a remote is served from a different origin than the host.

A hardcoded `/` would incorrectly request remote chunks from the host origin.

## Development Server Configuration

Each development server uses:

- its own port;
- `historyApiFallback: true`;
- CORS response headers;
- hot module replacement;
- no automatic browser opening.

```js
headers: {
  "Access-Control-Allow-Origin": "*",
}
```

The CORS header allows the host on port `3000` to load a remote entry from another local port.

## CSS Processing Pipeline

```text
CSS, SCSS, or Tailwind classes
  |
  v
css-loader
  |
  v
postcss-loader or sass-loader
  |
  v
style-loader in development
or extracted CSS in production
```

The exact loader chain depends on the file type and shared Webpack rules.

## Tailwind and PostCSS

PostCSS runs Tailwind and Autoprefixer.

Tailwind must scan source files from the host and remote applications that use utility classes. Missing content paths cause valid classes to be removed from production output.

A safe content strategy includes TypeScript and TSX files across all application folders.

```js
content: [
  "./host/src/**/*.{js,jsx,ts,tsx}",
  "./remotes/*/src/**/*.{js,jsx,ts,tsx}",
]
```

## Material UI and Emotion

MUI supplies structured components and theming. Emotion supplies its styling runtime.

Both MUI and Emotion packages are shared as singleton dependencies because multiple Emotion runtimes can create inconsistent style insertion and theme behavior.

Use MUI for:

- layout components;
- navigation;
- dialogs;
- form controls;
- theme-aware components.

Use Tailwind for:

- utility spacing;
- responsive layout helpers;
- simple typography and visual adjustments.

## Global CSS and Local CSS

Global CSS affects the entire integrated page. It should contain only true application-wide rules such as:

- resets;
- body styles;
- theme variables;
- shared typography;
- global utility layers.

Remote-specific styles should be scoped through:

- CSS Modules;
- a remote root class;
- MUI component styles;
- carefully namespaced selectors.

Avoid generic remote selectors such as `.card`, `.title`, or `button` because they can affect other applications.

## CSS Isolation Strategy

A practical remote namespace looks like:

```css
.cosmos-root .result-card {
  border-radius: 1rem;
}
```

CSS Modules provide stronger local naming:

```tsx
import styles from "./ResultCard.module.css";

export function ResultCard() {
  return <article className={styles.card}>Result</article>;
}
```

## Asset Locations

Use imported assets when the file belongs to a component and should participate in bundling.

```tsx
import logoUrl from "./assets/logo.svg";
```

Use `public/` when the asset must retain a stable public path, such as:

- favicon files;
- robots metadata;
- manifest files;
- files referenced before JavaScript executes.

The host copies its public assets into `dist` with Copy Webpack Plugin.

## Environment Variable Injection

Webpack replaces selected expressions at build time through `DefinePlugin`.

```js
new webpack.DefinePlugin({
  "process.env.REMOTE_COSMOS_URL": JSON.stringify(process.env.REMOTE_COSMOS_URL),
});
```

These values become part of the generated JavaScript. They are not secret at runtime.

Never place private credentials in frontend environment variables.

## Bundle Size Warnings

Micro-frontend builds may show large entrypoint warnings because eager shared dependencies include React, routing, Redux, MUI, Emotion, and other libraries in initial containers.

Warnings should be investigated, but they are not automatically failures.

Useful checks include:

- inspect production bundle composition;
- compare duplicated dependencies;
- verify singleton sharing;
- lazy-load domain pages;
- avoid importing large libraries through barrel files;
- remove unused assets and dependencies.

## Build Commands

```bash
npm run build:host
npm run build:cosmos
npm run build:atlas
npm run build:vault
npm run build:remotes
npm run build:all
```

`build:all` builds every remote before the host.

## Clean Commands

```bash
npm run clean
npm run clean:host
npm run clean:cosmos
npm run clean:atlas
npm run clean:vault
```

The scripts use `rm -rf`, which is native to macOS and Linux. Windows users should use Git Bash, WSL, or an equivalent cross-platform cleanup command.

## Common Problems

| Problem | Cause | Resolution |
| --- | --- | --- |
| Tailwind class missing in production | Source path not scanned | Add the file pattern to Tailwind content configuration |
| Remote chunk requested from host | Incorrect public path | Keep `publicPath: "auto"` |
| Styles differ between host and remote | Duplicate MUI or Emotion runtime | Share MUI and Emotion as singletons |
| Global style collision | Generic selectors in a remote | Namespace selectors or use CSS Modules |
| Asset works locally but not in production | Incorrect absolute path | Import the asset or verify copied public output |
| Environment variable is undefined | Root `.env` not loaded or DefinePlugin entry missing | Verify dotenv path and injected key |

## Best Practices

- Keep shared build rules centralized.
- Keep application-specific settings in each application Webpack file.
- Use hashed production filenames.
- Use `publicPath: "auto"` for remote chunks.
- Scope remote CSS.
- Keep frontend environment values non-secret.
- Analyze bundles before changing performance thresholds.
- Test production builds, not only dev servers.

## Summary

Discovery Hub combines a shared Webpack foundation with independently buildable applications. Correct public paths, scoped styling, compatible singleton UI libraries, and predictable asset handling are essential for reliable micro-frontend integration.