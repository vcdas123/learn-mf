const path = require("path");

// Resolve webpack from the calling app's node_modules
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

// Try to load dotenv (optional, might not be needed if env vars are set)
try {
  const dotenv = requireFromApp("dotenv");
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
} catch (e) {
  // dotenv is optional - environment variables can be set externally
  console.warn("dotenv not found, using environment variables directly");
}

/**
 * Module Federation Shared Dependencies
 *
 * All applications (host and remotes) must use these exact versions
 * for proper singleton sharing.
 */

const sharedDependencies = {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: true, // Eager loading for initial consumption
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^18.2.0",
    eager: true, // Eager loading for initial consumption
  },
  "react-router-dom": {
    singleton: true,
    requiredVersion: "^6.20.0",
    eager: true, // Eager loading for initial consumption
  },
  "react-redux": {
    singleton: true,
    requiredVersion: "^8.1.3",
    eager: true, // Eager loading for initial consumption
  },
  "@reduxjs/toolkit": {
    singleton: true,
    requiredVersion: "^1.9.7",
    eager: true, // Eager loading for initial consumption
  },
  zustand: {
    singleton: true,
    requiredVersion: "^4.4.7",
    eager: true, // Eager loading for standalone mode compatibility
  },
  "@mui/material": {
    singleton: true,
    requiredVersion: "^5.15.0",
    eager: true, // Eager loading for initial consumption
  },
  "@mui/icons-material": {
    singleton: true,
    requiredVersion: "^5.15.0",
    eager: true, // Eager loading for initial consumption
  },
  "@emotion/react": {
    singleton: true,
    requiredVersion: "^11.11.1",
    eager: true, // Eager loading for initial consumption
  },
  "@emotion/styled": {
    singleton: true,
    requiredVersion: "^11.11.0",
    eager: true, // Eager loading for initial consumption
  },
};

/**
 * Host Module Federation Configuration
 */
// exports.getHostConfig = () => {
//   const REMOTE_STUDENT_GRADES_URL =
//     process.env.REMOTE_STUDENT_GRADES_URL || "http://localhost:3105";
//   const REMOTE_ACTIVITY_LOG_URL =
//     process.env.REMOTE_ACTIVITY_LOG_URL || "http://localhost:3106";
//   const REMOTE_IMAGE_ANALYZER_URL =
//     process.env.REMOTE_IMAGE_ANALYZER_URL || "http://localhost:3107";

//   return {
//     name: "host",
//     remotes: {
//       "student-grades": `student_grades@${REMOTE_STUDENT_GRADES_URL}/remoteEntry.js`,
//       "activity-log": `activity_log@${REMOTE_ACTIVITY_LOG_URL}/remoteEntry.js`,
//       // image-analyzer remote uses image_analyzer as library name (no hyphens)
//       "image-analyzer": `image_analyzer@${REMOTE_IMAGE_ANALYZER_URL}/remoteEntry.js`,
//     },
//     shared: sharedDependencies,
//   };
// };
exports.getHostConfig = () => {
  const stripTrailingSlash = url => url.replace(/\/$/, "");

  const REMOTE_STUDENT_GRADES_URL = stripTrailingSlash(
    process.env.REMOTE_STUDENT_GRADES_URL || "http://localhost:3105",
  );
  const REMOTE_ACTIVITY_LOG_URL = stripTrailingSlash(
    process.env.REMOTE_ACTIVITY_LOG_URL || "http://localhost:3106",
  );
  const REMOTE_IMAGE_ANALYZER_URL = stripTrailingSlash(
    process.env.REMOTE_IMAGE_ANALYZER_URL || "http://localhost:3107",
  );

  return {
    name: "host",
    remotes: {
      "student-grades": `student_grades@${REMOTE_STUDENT_GRADES_URL}/remoteEntry.js`,
      "activity-log": `activity_log@${REMOTE_ACTIVITY_LOG_URL}/remoteEntry.js`,
      "image-analyzer": `image_analyzer@${REMOTE_IMAGE_ANALYZER_URL}/remoteEntry.js`,
    },
    shared: sharedDependencies,
  };
};

/**
 * Remote Module Federation Configuration
 */
exports.getRemoteConfig = remoteName => {
  const config = {
    name: remoteName,
    filename: "remoteEntry.js",
    exposes: {
      "./App": "./src/App.tsx",
    },
    shared: sharedDependencies,
  };

  // Fix for remote names with hyphens (e.g., "activity-log")
  // Use "var" type with a valid identifier (no hyphens)
  if (remoteName.includes("-")) {
    // Convert "activity-log" to "activity_log" for the library name
    const validIdentifier = remoteName.replace(/-/g, "_");
    config.library = {
      type: "var",
      name: validIdentifier,
    };
  }

  return config;
};
