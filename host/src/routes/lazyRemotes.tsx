import { lazy } from "react";
import { loadRemoteModule } from "../utils/loadRemote";

const remoteCache: Record<string, Promise<any> | undefined> = {};

function retryRemoteLoad<T>(
  remoteName: string,
  loadFn: () => Promise<T>,
  maxRetries: number = 5,
  retryDelay: number = 1000
): Promise<T> {
  if (remoteCache[remoteName]) {
    return remoteCache[remoteName];
  }

  const loadPromise = new Promise<T>((resolve, reject) => {
    let attempts = 0;

    const attemptLoad = () => {
      attempts++;
      loadFn()
        .then((module) => {
          resolve(module);
        })
        .catch((error) => {
          const errorMessage = error?.message || String(error);
          const isRetryableError =
            errorMessage.includes("Loading script failed") ||
            errorMessage.includes("remoteEntry") ||
            errorMessage.includes("net::ERR") ||
            errorMessage.includes("Failed to fetch") ||
            errorMessage.includes("ScriptExternalLoadError") ||
            error?.name === "ScriptExternalLoadError";

          if (isRetryableError && attempts < maxRetries) {
            console.warn(
              `Failed to load remote ${remoteName} (attempt ${attempts}/${maxRetries}). Retrying in ${retryDelay}ms...`,
              errorMessage
            );
            setTimeout(attemptLoad, retryDelay);
          } else {
            delete remoteCache[remoteName];
            reject(error);
          }
        });
    };

    attemptLoad();
  });

  remoteCache[remoteName] = loadPromise;
  return loadPromise;
}

export const CosmosRemote = lazy(() =>
  retryRemoteLoad("cosmos", () =>
    loadRemoteModule("cosmos", "./App")
  )
);

export const AtlasRemote = lazy(() =>
  retryRemoteLoad("atlas", () =>
    loadRemoteModule("atlas", "./App")
  )
);
