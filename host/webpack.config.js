const { merge } = require("webpack-merge");
const commonConfig = require("../shared/webpack.common");
const { getHostConfig } = require("../shared/webpack.module-federation");
const webpack = require("webpack");
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
const path = require("path");

// Load dotenv if available
try {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
} catch (e) {
  // dotenv is optional
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production" || env?.mode === "production";
  const PORT = process.env.HOST_PORT || 3000;

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

  const common = commonConfig(env);

  // Host always needs HtmlWebpackPlugin (even in production)
  const HtmlWebpackPlugin = requireFromApp("html-webpack-plugin");
  const hostPlugins = [
    ...common.plugins,
    // Add HtmlWebpackPlugin for host if not already present
    ...(common.plugins.some((p) => p instanceof HtmlWebpackPlugin)
      ? []
      : [
          new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            inject: "body",
            minify: isProduction
              ? {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                }
              : false,
          }),
        ]),
  ];

  const config = merge(common, {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.tsx",
    devServer: {
      port: Number(PORT),
      open: true,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      hot: true,
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
    plugins: [...hostPlugins, new ModuleFederationPlugin(getHostConfig())],
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash:8].js" : "[name].bundle.js",
      chunkFilename: isProduction
        ? "[name].[contenthash:8].chunk.js"
        : "[name].chunk.js",
      clean: true,
      publicPath: "auto",
    },
    // Suppress warnings for Module Federation dynamic imports
    // These are expected warnings when using dynamic imports with Module Federation
    ignoreWarnings: [
      {
        module: /ModuleFederationPlugin/,
      },
      {
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ],
  });

  return config;
};
