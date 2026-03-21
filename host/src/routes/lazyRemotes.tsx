import { lazy } from "react";

// Cache to store remote loading promises to prevent double-fetching
const remoteCache: Record<string, Promise<any> | undefined> = {};

/**
 * Retry wrapper for Module Federation remote loading
 *
 * Retries loading remote modules if they fail initially (e.g., remote server not ready).
 * Uses a cache to prevent multiple simultaneous load attempts for the same remote.
 */
function retryRemoteLoad<T>(
  remoteName: string,
  loadRemote: () => Promise<T>,
  maxRetries: number = 5,
  retryDelay: number = 1000
): Promise<T> {
  // If we're already loading this remote, return the existing promise
  if (remoteCache[remoteName]) {
    return remoteCache[remoteName];
  }

  const loadPromise = new Promise<T>((resolve, reject) => {
    let attempts = 0;

    const attemptLoad = () => {
      attempts++;

      loadRemote()
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
            // Remove from cache on failure so we can try again later
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

/**
 * Lazy loaded remote applications with retry logic
 */

export const StudentGradesRemote = lazy(() =>
  retryRemoteLoad("student-grades", () => {
    // @ts-expect-error - Module Federation remote module (types resolved at runtime)
    return import("student-grades/App");
  })
);

export const ActivityLogRemote = lazy(() =>
  retryRemoteLoad("activity-log", () => {
    // @ts-expect-error - Module Federation remote module (types resolved at runtime)
    return import("activity-log/App");
  })
);

export const ImageAnalyzerRemote = lazy(() =>
  retryRemoteLoad("image-analyzer", () => {
    // @ts-expect-error - Module Federation remote module (types resolved at runtime)
    return import("image-analyzer/App");
  })
);
