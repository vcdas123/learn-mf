const { merge } = require("webpack-merge");
const commonConfig = require("../../sharedConfigs/webpack.common");
const { getRemoteConfig } = require("../../sharedConfigs/webpack.module-federation");
const webpack = require("webpack");
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
const path = require("path");

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

try {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
} catch (e) {}

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production" || env?.mode === "production";
  const PORT = process.env.REMOTE_ATLAS_PORT || 3106;
  const common = commonConfig(env);

  const config = merge(common, {
    mode: isProduction ? "production" : "development",
    entry: "./src/dev.tsx",
    devServer: {
      port: Number(PORT),
      open: false,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      hot: !isProduction,
    },
    devtool: isProduction ? "hidden-source-map" : "eval-source-map",
    plugins: [
      ...common.plugins,
      new ModuleFederationPlugin(getRemoteConfig("atlas")),
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
