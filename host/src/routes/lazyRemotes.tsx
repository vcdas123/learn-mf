import { lazy } from "react";

/**
 * Lazy loaded remote applications
 * 
 * These are dynamically imported React components from remote applications
 * using Module Federation. Errors are caught by RemoteErrorBoundary.
 */

// @ts-ignore - Module Federation remote types (dynamic imports, types resolved at runtime)
export const GradeRemote = lazy(() => import("grade/App"));

// @ts-ignore - Module Federation remote types (dynamic imports, types resolved at runtime)
export const DynamicLogSheetRemote = lazy(() => import("dynamiclogsheet/App"));

// @ts-ignore - Module Federation remote types (dynamic imports, types resolved at runtime)
export const AiVisionRemote = lazy(() => import("ai-vision/App"));

