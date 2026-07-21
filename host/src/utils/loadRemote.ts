// Dynamic remote loading - fetches remoteEntry.js only when the route is accessed

declare const __webpack_share_scopes__: Record<string, any>;
declare namespace NodeJS {
  interface ProcessEnv {
    REMOTE_COSMOS_URL: string;
    REMOTE_ATLAS_URL: string;
    REMOTE_VAULT_URL: string;
  }
}
declare const process: { env: NodeJS.ProcessEnv };

const remoteContainerCache: Record<string, any> = {};
const remoteEntryCache: Record<string, Promise<void>> = {};

const REMOTE_URLS: Record<string, string | undefined> = {
  cosmos: process.env.REMOTE_COSMOS_URL,
  atlas: process.env.REMOTE_ATLAS_URL,
  vault: process.env.REMOTE_VAULT_URL,
};

function resolveRemoteEntryUrl(remoteName: string): string {
  const envUrl = REMOTE_URLS[remoteName]?.trim();

  const fallbackUrls: Record<string, string> = {
    cosmos: "https://cosmos-xi-one.vercel.app",
    atlas: "https://atlas-xi-one.vercel.app",
    vault: "https://vault-xi-one.vercel.app",
  };
  const fallbackUrl = fallbackUrls[remoteName];

  if (!fallbackUrl) {
    return "";
  }

  let configuredUrl: URL;
  try {
    configuredUrl = new URL(envUrl || fallbackUrl);
  } catch {
    configuredUrl = new URL(fallbackUrl);
  }

  // A remote must not resolve against the host deployment. This commonly happens
  // when a Vercel environment variable is set to `/cosmos` or to the host route.
  // It works during client navigation, but a hard refresh then requests the remote
  // container from learn-mf.vercel.app instead of the Cosmos deployment.
  const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  );
  if (!isLocalDevelopment && configuredUrl.origin === window.location.origin) {
    configuredUrl = new URL(fallbackUrl);
  }

  configuredUrl.pathname = configuredUrl.pathname
    .replace(/\/$/, "")
    .replace(/\/remoteEntry\.js$/, "");

  return `${configuredUrl.toString().replace(/\/$/, "")}/remoteEntry.js`;
}

async function loadRemoteEntry(remoteName: string): Promise<void> {
  console.log(`Loading remote entry for: ${remoteName}`);
  if (remoteEntryCache[remoteName] !== undefined) {
    return remoteEntryCache[remoteName];
  }

  const entryUrl = resolveRemoteEntryUrl(remoteName);
  if (!entryUrl) {
    throw new Error(`Unknown remote: ${remoteName}`);
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = entryUrl;
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      delete remoteEntryCache[remoteName];
      reject(new Error(`Failed to load remote entry: ${entryUrl}`));
    };

    document.head.appendChild(script);
  });

  remoteEntryCache[remoteName] = promise;
  return promise;
}

async function getRemoteContainer(remoteName: string) {
  if (remoteContainerCache[remoteName]) {
    return remoteContainerCache[remoteName];
  }

  await loadRemoteEntry(remoteName);

  const container = (window as any)[remoteName];
  if (!container) {
    throw new Error(
      `Remote container "${remoteName}" not found on window after loading entry. ` +
      `Make sure the remote's Module Federation config exposes the correct name.`
    );
  }

  await container.init(__webpack_share_scopes__.default);
  remoteContainerCache[remoteName] = container;
  return container;
}

export async function loadRemoteModule<T = any>(
  remoteName: string,
  moduleName: string
): Promise<T> {
  const container = await getRemoteContainer(remoteName);
  const factory = await container.get(moduleName);
  return factory();
}
