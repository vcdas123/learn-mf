import { lazy } from "react";

/**
 * Retry wrapper for Module Federation remote loading
 *
 * Retries loading remote modules if they fail initially (e.g., remote server not ready).
 * This handles the common case where the host tries to load a remote before it's fully started.
 *
 * @param loadRemote - Function that returns the remote import promise
 * @param maxRetries - Maximum number of retry attempts (default: 5)
 * @param retryDelay - Delay between retries in milliseconds (default: 1000)
 * @returns Promise that resolves to the remote module
 */
function retryRemoteLoad<T>(
  loadRemote: () => Promise<T>,
  maxRetries: number = 5,
  retryDelay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
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
              `Failed to load remote (attempt ${attempts}/${maxRetries}). Retrying in ${retryDelay}ms...`,
              errorMessage
            );
            setTimeout(attemptLoad, retryDelay);
          } else {
            reject(error);
          }
        });
    };

    attemptLoad();
  });
}

/**
 * Lazy loaded remote applications with retry logic
 *
 * These are dynamically imported React components from remote applications
 * using Module Federation. The retry wrapper handles cases where remotes
 * aren't ready yet (e.g., on first load). Errors are caught by RemoteErrorBoundary.
 */

export const StudentGradesRemote = lazy(() =>
  retryRemoteLoad(() => {
    // @ts-expect-error - Module Federation remote module (types resolved at runtime)
    return import("student-grades/App");
  })
);

export const ActivityLogRemote = lazy(() =>
  retryRemoteLoad(() => {
    // @ts-expect-error - Module Federation remote module (types resolved at runtime)
    return import("activity-log/App");
  })
);

export const ImageAnalyzerRemote = lazy(() =>
  retryRemoteLoad(() => {
    // @ts-expect-error - Module Federation remote module (types resolved at runtime)
    return import("image-analyzer/App");
  })
);
