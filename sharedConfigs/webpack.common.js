const path = require("path");

// Resolve modules from the calling app's node_modules
// This allows the shared config to work from different locations
function requireFromApp(moduleName) {
  // Try multiple resolution paths
  const pathsToTry = [
    process.cwd(), // Current working directory (where npm run dev is executed)
    path.resolve(process.cwd(), "node_modules"),
    __dirname, // Fallback to sharedConfigs directory
    path.resolve(__dirname, ".."), // Parent directory
  ];

  for (const tryPath of pathsToTry) {
    try {
      const resolved = require.resolve(moduleName, { paths: [tryPath] });
      return require(resolved);
    } catch (e) {
      // Continue to next path
      continue;
    }
  }

  // Final fallback - might fail but gives better error
  try {
    return require(moduleName);
  } catch (e) {
    throw new Error(
      `Cannot find module '${moduleName}'. Tried paths: ${pathsToTry.join(
        ", "
      )}. ` + `Make sure it's installed in your app's node_modules.`
    );
  }
}

// Lazy load plugins to ensure proper resolution
function getHtmlWebpackPlugin() {
  return requireFromApp("html-webpack-plugin");
}

function getMiniCssExtractPlugin() {
  return requireFromApp("mini-css-extract-plugin");
}

/**
 * Common Webpack Configuration
 *
 * Shared configuration for host and all remote applications.
 * Merged with environment-specific configs (dev/prod).
 */

module.exports = (env = {}) => {
  const isProduction = env.mode === "production";
  const isDevelopment = !isProduction;

  // Lazy load plugins to ensure they're resolved from the correct location
  const HtmlWebpackPlugin = getHtmlWebpackPlugin();
  const MiniCssExtractPlugin = getMiniCssExtractPlugin();

  return {
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      alias: {
        "@": path.resolve(__dirname, "../"),
      },
    },
    module: {
      rules: [
        // TypeScript/JavaScript
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
            },
          },
        },

        // CSS - Tailwind CSS, regular CSS
        {
          test: /\.css$/i,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: /\.module\.css$/i,
                },
                importLoaders: 2,
              },
            },
            "postcss-loader",
          ],
        },

        // SCSS/SASS
        {
          test: /\.(scss|sass)$/i,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: /\.module\.(scss|sass)$/i,
                },
                importLoaders: 3,
              },
            },
            "postcss-loader",
            "sass-loader",
          ],
        },

        // Images
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb - inline as base64, larger as files
            },
          },
          generator: {
            filename: "assets/images/[name].[hash:8][ext]",
          },
        },

        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name].[hash:8][ext]",
          },
        },

        // Favicons
        {
          test: /\.ico$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/favicons/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      // HtmlWebpackPlugin for all apps (both dev and production)
      // Remotes can run standalone in production too
      new HtmlWebpackPlugin({
        // Use each app's own public/index.html template
        // process.cwd() is the app directory (host/ or remotes/*/)
        template: path.resolve(process.cwd(), "public/index.html"),
        inject: "body",
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
            }
          : false,
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "css/[name].[contenthash:8].css",
              chunkFilename: "css/[name].[contenthash:8].chunk.css",
            }),
          ]
        : []),
    ],
    optimization: {
      minimize: isProduction,
      splitChunks: isProduction
        ? {
            chunks: "all",
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          }
        : false,
    },
    // Output is defined per app in their webpack.config.js
  };
};
