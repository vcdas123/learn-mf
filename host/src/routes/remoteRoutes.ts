import React from "react";
import {
  GradeRemote,
  DynamicLogSheetRemote,
  AiVisionRemote,
} from "./lazyRemotes";

/**
 * Remote route configuration
 *
 * Centralized configuration for remote application routes.
 * Used to generate route definitions and navigation items.
 */

export interface RemoteRoute {
  path: string;
  label: string;
  moduleName: string;
  routePath: string; // The route path pattern (e.g., "/grades/*")
}

export const remoteRoutes: RemoteRoute[] = [
  {
    path: "/grades",
    label: "Grades",
    moduleName: "grade",
    routePath: "/grades/*",
  },
  {
    path: "/logsheet",
    label: "Log Sheet",
    moduleName: "dynamiclogsheet",
    routePath: "/logsheet/*",
  },
  {
    path: "/ai-vision",
    label: "AI Vision",
    moduleName: "ai-vision",
    routePath: "/ai-vision/*",
  },
];

/**
 * Map remote module names to their lazy-loaded components
 *
 * This mapping connects the moduleName from remoteRoutes to the
 * actual lazy-loaded React component.
 */
export const remoteComponentMap: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  grade: GradeRemote,
  dynamiclogsheet: DynamicLogSheetRemote,
  "ai-vision": AiVisionRemote,
};

export type RemoteComponentKey = keyof typeof remoteComponentMap;

export interface FeatureConfig {
  path: string;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  borderColor: string;
  badge: string;
}

export const featureConfigs: FeatureConfig[] = [
  {
    path: "/grades",
    emoji: "📚",
    title: "Grade Module",
    desc: "Manage student grades and assessments with Zustand state management",
    color: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    badge: "Zustand",
  },
  {
    path: "/logsheet",
    emoji: "📋",
    title: "Dynamic Log Sheet",
    desc: "Track and manage log entries with real-time updates",
    color: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    badge: "MUI",
  },
  {
    path: "/ai-vision",
    emoji: "🤖",
    title: "AI Vision",
    desc: "AI-powered image analysis and insights with advanced features",
    color: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-200",
    badge: "AI",
  },
];
