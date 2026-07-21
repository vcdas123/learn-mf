import React from "react";
import { CosmosRemote, AtlasRemote, VaultRemote } from "./lazyRemotes";

export interface RemoteRoute {
  path: string;
  label: string;
  moduleName: string;
  routePath: string;
}

export const remoteRoutes: RemoteRoute[] = [
  {
    path: "/cosmos",
    label: "Cosmos",
    moduleName: "cosmos",
    routePath: "/cosmos/*",
  },
  {
    path: "/atlas",
    label: "Atlas",
    moduleName: "atlas",
    routePath: "/atlas/*",
  },
  {
    path: "/vault",
    label: "Vault",
    moduleName: "vault",
    routePath: "/vault/*",
  },
];

export const remoteComponentMap: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  cosmos: CosmosRemote,
  atlas: AtlasRemote,
  vault: VaultRemote,
};

export type RemoteComponentKey = keyof typeof remoteComponentMap;

export interface FeatureConfig {
  path: string;
  emoji: string;
  title: string;
  desc: string;
  badge: string;
}

export const featureConfigs: FeatureConfig[] = [
  {
    path: "/cosmos",
    emoji: "\u2728",
    title: "Cosmos",
    desc: "Explore the universe through NASA's Astronomy Picture of the Day. Browse stunning space imagery with detailed scientific explanations.",
    badge: "NASA API",
  },
  {
    path: "/atlas",
    emoji: "\uD83D\uDDFA\uFE0F",
    title: "Atlas",
    desc: "Discover books from the world's largest open library and track real-time seismic activity across the globe.",
    badge: "Open Library + USGS",
  },
  {
    path: "/vault",
    emoji: "\uD83D\uDCB0",
    title: "Vault",
    desc: "Live precious metal prices, converters, karat pricing, and historical data from goldprice.dev.",
    badge: "goldprice.dev",
  },
];
