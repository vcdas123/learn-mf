const { merge } = require("webpack-merge");
const commonConfig = require("../../sharedConfigs/webpack.common");
const { getRemoteConfig } = require("../../sharedConfigs/webpack.module-federation");
const webpack = require("webpack");
const path = require("path");

try {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
} catch (e) {}

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const PORT = process.env.REMOTE_VAULT_PORT || 3107;

  const common = commonConfig(env);

  return merge(common, {
    mode: isProduction ? "production" : "development",
    entry: "./src/dev.tsx",
    devServer: {
      port: Number(PORT),
      open: false,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      hot: true,
    },
    devtool: isProduction ? "hidden-source-map" : "eval-source-map",
    plugins: [
      ...common.plugins,
      new (require("webpack").container.ModuleFederationPlugin)(
        getRemoteConfig("vault")
      ),
      new webpack.DefinePlugin({
        "process.env.REACT_APP_GOLDAPI_KEY": JSON.stringify(
          process.env.REACT_APP_GOLDAPI_KEY
        ),
      }),
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
    ignoreWarnings: [
      { module: /ModuleFederationPlugin/ },
      { message: /Critical dependency: the request of a dependency is an expression/ },
    ],
  });
};
