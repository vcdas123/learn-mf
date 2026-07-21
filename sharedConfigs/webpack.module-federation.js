const path = require("path");

function requireFromApp(moduleName) {
  const pathsToTry = [
    process.cwd(),
    path.resolve(process.cwd(), "node_modules"),
    __dirname,
  ];
  for (const tryPath of pathsToTry) {
    try {
      const resolved = require.resolve(moduleName, { paths: [tryPath] });
      return require(resolved);
    } catch (e) {
      continue;
    }
  }
  return require(moduleName);
}

const webpack = requireFromApp("webpack");
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

try {
  const dotenv = requireFromApp("dotenv");
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
} catch (e) {
  console.warn("dotenv not found, using environment variables directly");
}

const sharedDependencies = {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: true,
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: true,
  },
  "react-router-dom": {
    singleton: true,
    requiredVersion: "^6.20.0",
    eager: true,
  },
  "react-redux": {
    singleton: true,
    requiredVersion: "^8.1.3",
    eager: true,
  },
  "@reduxjs/toolkit": {
    singleton: true,
    requiredVersion: "^1.9.7",
    eager: true,
  },
  zustand: {
    singleton: true,
    requiredVersion: "^4.4.7",
    eager: true,
  },
  "@mui/material": {
    singleton: true,
    requiredVersion: "^5.15.0",
    eager: true,
  },
  "@mui/icons-material": {
    singleton: true,
    requiredVersion: "^5.15.0",
    eager: true,
  },
  "@emotion/react": {
    singleton: true,
    requiredVersion: "^11.11.1",
    eager: true,
  },
  "@emotion/styled": {
    singleton: true,
    requiredVersion: "^11.11.0",
    eager: true,
  },
};

exports.getHostConfig = () => {
  const stripTrailingSlash = url => url.replace(/\/$/, "");
  const REMOTE_COSMOS_URL = stripTrailingSlash(
    process.env.REMOTE_COSMOS_URL || "http://localhost:3105",
  );
  const REMOTE_ATLAS_URL = stripTrailingSlash(
    process.env.REMOTE_ATLAS_URL || "http://localhost:3106",
  );

  return {
    name: "host",
    remotes: {
      cosmos: `cosmos@${REMOTE_COSMOS_URL}/remoteEntry.js`,
      atlas: `atlas@${REMOTE_ATLAS_URL}/remoteEntry.js`,
    },
    shared: sharedDependencies,
  };
};

exports.getRemoteConfig = remoteName => {
  const config = {
    name: remoteName,
    filename: "remoteEntry.js",
    exposes: {
      "./App": "./src/App.tsx",
    },
    shared: sharedDependencies,
  };

  if (remoteName.includes("-")) {
    const validIdentifier = remoteName.replace(/-/g, "_");
    config.library = {
      type: "var",
      name: validIdentifier,
    };
  }

  return config;
};
