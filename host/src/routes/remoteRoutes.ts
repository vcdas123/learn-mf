import React from "react";
import {
  StudentGradesRemote,
  ActivityLogRemote,
  ImageAnalyzerRemote,
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
    path: "/student-grades",
    label: "Student Grades",
    moduleName: "student-grades",
    routePath: "/student-grades/*",
  },
  {
    path: "/activity-log",
    label: "Activity Log",
    moduleName: "activity-log",
    routePath: "/activity-log/*",
  },
  {
    path: "/image-analyzer",
    label: "Image Analyzer",
    moduleName: "image-analyzer",
    routePath: "/image-analyzer/*",
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
  "student-grades": StudentGradesRemote,
  "activity-log": ActivityLogRemote,
  "image-analyzer": ImageAnalyzerRemote,
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
    path: "/student-grades",
    emoji: "📚",
    title: "Student Grades",
    desc: "Manage student grades and assessments with Zustand state management",
    color: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    badge: "Zustand",
  },
  {
    path: "/activity-log",
    emoji: "📋",
    title: "Activity Log",
    desc: "Track and manage activity log entries with real-time updates",
    color: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    badge: "MUI",
  },
  {
    path: "/image-analyzer",
    emoji: "🖼️",
    title: "Image Analyzer",
    desc: "AI-powered image analysis and insights with advanced features",
    color: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-200",
    badge: "AI",
  },
];
