# Module Federation Runtime and Execution Flow

This note explains how Discovery Hub loads remote applications at runtime, how Webpack share scopes are initialized, and how standalone execution differs from host-integrated execution.

## Why Runtime Loading Is Used

The host does not declare fixed remote URLs inside the `remotes` field of `ModuleFederationPlugin`. Instead, it loads remote containers dynamically when users visit a remote route.

This provides:

- environment-specific remote URLs;
- independent remote deployments;
- route-level loading;
- smaller initial host work;
- retry and error handling controlled by application code;
- the ability to change a remote deployment without changing federation source configuration.

## Remote Federation Configuration

Every remote exposes its application component through `remoteEntry.js`.

```js
{
  name: remoteName,
  filename: "remoteEntry.js",
  exposes: {
    "./App": "./src/App.tsx",
  },
  shared: sharedDependencies,
}
```

The `name` becomes the global container name placed on `window` after the remote entry script executes.

## Host Federation Configuration

The host participates in the shared scope but does not use static remote declarations.

```js
{
  name: "host",
  remotes: {},
  shared: sharedDependencies,
}
```

Runtime code is therefore responsible for loading the remote script and requesting the exposed module.

## Integrated Execution Flow

```text
User opens /cosmos
  |
  v
React Router selects Cosmos route
  |
  v
React.lazy invokes loadRemoteModule
  |
  v
Resolve Cosmos base URL
  |
  v
Append /remoteEntry.js
  |
  v
Inject script into document.head
  |
  v
Read window.cosmos
  |
  v
Initialize Webpack share scope
  |
  v
container.get("./App")
  |
  v
Factory returns remote module
  |
  v
Remote renders inside host context
```

## Remote URL Resolution

The host reads remote base URLs from environment variables.

```text
REMOTE_COSMOS_URL
REMOTE_ATLAS_URL
REMOTE_VAULT_URL
```

The loader normalizes the configured value before appending `remoteEntry.js`.

A correct value is a remote origin such as:

```text
http://localhost:3105
```

or:

```text
https://cosmos-xi-one.vercel.app
```

A relative route such as `/cosmos` is incorrect in production because it resolves against the host origin rather than the independently deployed remote.

## Script Injection

The runtime loader creates a script element.

```ts
const script = document.createElement("script");
script.src = entryUrl;
script.type = "text/javascript";
script.async = true;
document.head.appendChild(script);
```

The promise resolves after the browser executes the remote entry. It rejects when the script cannot be downloaded.

## Container Initialization

After the script loads, the container is read from `window`.

```ts
const container = (window as any)[remoteName];
await container.init(__webpack_share_scopes__.default);
```

`container.init` connects the remote to the host's default Webpack share scope. This is how both builds agree on shared singleton instances.

## Loading the Exposed Module

The loader requests the exposed module and executes its factory.

```ts
const factory = await container.get("./App");
return factory();
```

The returned module is consumed by `React.lazy`, so its default export must be a renderable React component.

## Caching Behavior

Discovery Hub caches:

- remote-entry loading promises;
- initialized remote containers;
- lazy remote module promises.

Caching prevents duplicate script tags and repeated container initialization when users revisit a route.

A failed entry promise is removed from the cache so a later attempt can retry.

## Retry Behavior

Retryable remote-loading errors are attempted multiple times. Typical retryable failures include:

- `Loading script failed`;
- `ScriptExternalLoadError`;
- a failed `remoteEntry.js` request;
- browser network errors;
- temporary deployment unavailability.

The current lazy loader retries up to five times with a delay between attempts.

## Suspense and Error Boundaries

The host wraps every remote with both `Suspense` and a remote-specific error boundary.

```tsx
<RemoteErrorBoundary moduleName={route.moduleName}>
  <Suspense fallback={<RemoteLoading moduleName={route.moduleName} />}>
    <RemoteComponent />
  </Suspense>
</RemoteErrorBoundary>
```

`Suspense` handles the pending promise. The error boundary handles a rejected promise or render failure.

## Standalone Remote Execution

Standalone development uses `src/dev.tsx` as the Webpack entry.

```text
remote development server
  |- creates its own React root
  |- creates development providers
  |- creates its own router when needed
  `- renders App directly
```

This path exists only so a remote team can work without running the host.

## Hosted Remote Execution

When the host consumes the remote:

```text
host React root
  `- host providers
      `- host router
          `- remote App component
```

The remote's standalone entry file is not executed. Only the exposed `App.tsx` module is requested.

## Eager Singleton Sharing

Critical dependencies are marked with both `singleton: true` and `eager: true`.

```js
react: {
  singleton: true,
  requiredVersion: "^18.2.0",
  eager: true,
}
```

`singleton` asks Webpack to use one shared instance. `eager` places the shared module in the initial providing chunk instead of creating an additional asynchronous share chunk.

The trade-off is a larger entry bundle. The benefit is predictable availability of critical runtime libraries.

## Public Path

Every build uses:

```js
output: {
  publicPath: "auto",
}
```

With `auto`, Webpack derives the base URL for asynchronously loaded chunks from the script that loaded the bundle. This is essential when the remote and host live on different origins.

## Failure Scenarios

| Symptom | Likely cause |
| --- | --- |
| Remote container missing on `window` | Federation `name` does not match runtime remote name |
| `remoteEntry.js` returns host HTML | Remote URL points to the host or an SPA rewrite is too broad |
| Async chunk returns 404 | Incorrect public path or missing deployment output |
| Invalid hook call | More than one React instance was loaded |
| Router context error | Remote created or expected the wrong router boundary |
| Container already initialized differently | Share scopes or duplicate loaders are inconsistent |

## Best Practices

- Keep remote names consistent across Webpack, routes, and runtime maps.
- Verify `remoteEntry.js` directly before debugging React code.
- Cache both entry promises and initialized containers.
- Remove failed promises from cache.
- Initialize the default share scope before calling `get`.
- Use `publicPath: "auto"` for independently hosted remotes.
- Test hard refreshes on nested host routes.
- Keep remote builds backward-compatible with the host contract.

## Summary

Discovery Hub performs true runtime federation. Remote scripts are resolved from configuration, injected only when needed, initialized against the host share scope, cached, retried on temporary failures, and rendered through React lazy loading and error boundaries.