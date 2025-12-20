const { merge } = require("webpack-merge");
const commonConfig = require("../../sharedConfigs/webpack.common");
const { getRemoteConfig } = require("../../sharedConfigs/webpack.module-federation");
const webpack = require("webpack");
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
const path = require("path");

// Helper to require modules from app's node_modules
function requireFromApp(moduleName) {
  const pathsToTry = [
    process.cwd(),
    path.resolve(process.cwd(), "node_modules"),
    __dirname,
  ];
  for (const tryPath of pathsToTry) {
    try {
      return require(require.resolve(moduleName, { paths: [tryPath] }));
    } catch (e) {
      continue;
    }
  }
  return require(moduleName);
}

// Load dotenv if available
try {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
} catch (e) {
  // dotenv is optional
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production" || env?.mode === "production";
  const PORT = process.env.REMOTE_AI_VISION_PORT || 3107;

  // Get common config
  const common = commonConfig(env);

  const config = merge(common, {
    mode: isProduction ? "production" : "development",
    // Entry point: dev.tsx for standalone mode (works in both dev and production)
    // In production, remotes can still run standalone via their own URL
    entry: "./src/dev.tsx",
    devServer: {
      port: Number(PORT),
      open: true,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      hot: !isProduction,
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
    plugins: [
      ...common.plugins,
      new ModuleFederationPlugin(getRemoteConfig("ai-vision")),
    ],
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash:8].js" : "[name].bundle.js",
      chunkFilename: isProduction
        ? "[name].[contenthash:8].chunk.js"
        : "[name].chunk.js",
      clean: true,
      publicPath: "auto",
    },
  });

  return config;
};
