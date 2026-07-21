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

const REMOTE_URLS: Record<string, string> = {
  cosmos: process.env.REMOTE_COSMOS_URL,
  atlas: process.env.REMOTE_ATLAS_URL,
  vault: process.env.REMOTE_VAULT_URL,
};

function resolveRemoteUrl(remoteName: string): string {
  const envUrl = REMOTE_URLS[remoteName];
  
  // Fallback mapping for production if env vars are missing or relative
  const fallbackUrls: Record<string, string> = {
    cosmos: "https://cosmos-xi-one.vercel.app",
    atlas: "https://atlas-xi-one.vercel.app",
    vault: "https://vault-xi-one.vercel.app",
  };

  if (!envUrl || envUrl.trim() === "" || envUrl === "undefined") {
    return fallbackUrls[remoteName] || "";
  }

  // If it's a relative URL, or doesn't start with http/https, fall back to production absolute URL
  if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
    return fallbackUrls[remoteName] || envUrl;
  }

  return envUrl;
}

async function loadRemoteEntry(remoteName: string): Promise<void> {
  if (remoteEntryCache[remoteName] !== undefined) {
    return remoteEntryCache[remoteName];
  }

  const url = resolveRemoteUrl(remoteName);
  if (!url) {
    throw new Error(`Unknown remote: ${remoteName}`);
  }

  // Remove any trailing slash to prevent double-slashes in the constructed path
  const baseUrl = url.replace(/\/$/, "");
  const entryUrl = `${baseUrl}/remoteEntry.js`;

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
