/**
 * Webpack Production Configuration
 *
 * This file configures webpack for building your application in production mode.
 * Production builds are optimized for performance, smaller file sizes, and better caching.
 */

// Import required Node.js modules and webpack plugins
const path = require("path"); // Node.js path utility for handling file paths
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Generates HTML files
// const TerserPlugin = require("terser-webpack-plugin"); // Minifies JavaScript code
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Extracts CSS into separate files
const { DefinePlugin } = require("webpack"); // Defines global constants
const EsbuildPlugin = require("esbuild-loader").EsbuildPlugin; // Use esbuild for minification

// Export the webpack configuration object
module.exports = {
  // ========================================
  // BASIC CONFIGURATION
  // ========================================

  mode: "production", // Enables production optimizations (minification, tree shaking, etc.)
  devtool: "source-map", // Generates source maps for debugging (useful even in production)

  // Entry point - where webpack starts building the dependency graph
  entry: "./src/components/index.js",

  // ========================================
  // OUTPUT CONFIGURATION
  // ========================================
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory (absolute path)
    filename: "[name].bundle.js", // Output filename pattern
  },

  // ========================================
  // RESOLVE CONFIGURATION
  // ========================================
  resolve: {
    // File extensions to resolve automatically (no need to write .js or .jsx)
    extensions: [".js", ".jsx"],
    // Path aliases for cleaner imports
    alias: {
      "@": path.resolve(__dirname, "src"), // @/ will point to the src directory
    },
  },

  // ========================================
  // PLUGINS
  // ========================================
  plugins: [
    // Generates an HTML file that includes your bundled JavaScript
    new HtmlWebpackPlugin({
      template: "./public/index.html", // HTML template to use
      path: "index.html", // Output HTML filename
    }),

    // Extracts CSS from JavaScript bundles into separate CSS files
    new MiniCssExtractPlugin({
      filename: "[name].css", // CSS filename pattern
    }),

    // Defines global constants that can be used in your code
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"), // Sets NODE_ENV to production
    }),
  ],

  // ========================================
  // MODULE RULES (LOADERS)
  // ========================================
  module: {
    rules: [
      // JavaScript/JSX files processing
      {
        test: /\.(js|jsx)$/, // Files to process (regex pattern)
        exclude: /node_modules/, // Don't process node_modules
        use: {
          loader: "babel-loader", // Transpiles modern JS/JSX to browser-compatible code
          options: {
            presets: [
              "@babel/preset-env", // Transpiles ES6+ to ES5
              "@babel/preset-react", // Transpiles JSX to JavaScript
            ],
          },
        },
      },

      // CSS files processing
      {
        test: /\.css$/, // CSS files
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into separate files
          "css-loader", // Interprets @import and url() in CSS
        ],
      },

      // Image files processing
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Image file extensions (case insensitive)
        type: "asset/resource", // Emits files as separate assets
      },
    ],
  },

  // ========================================
  // OPTIMIZATION
  // ========================================
  optimization: {
    minimize: true, // Enable minification

    // Minification configuration
    minimizer: [
      // new TerserPlugin({
      //   parallel: true, // Use multiple CPU cores for faster minification
      // }),
      new EsbuildPlugin({
        target: "es2015", // or your desired target
        css: true,        // Enable CSS minification
      }),
    ],

    // Code splitting configuration
    splitChunks: {
      chunks: "async", // Only split async chunks (lazy-loaded modules)
      minSize: 20000, // Minimum size (20KB) for a chunk to be created
      minRemainingSize: 0, // Minimum size for remaining chunks
      minChunks: 1, // Minimum number of chunks that must share a module
      maxAsyncRequests: 30, // Maximum number of async requests
      maxInitialRequests: 30, // Maximum number of initial requests
      enforceSizeThreshold: 50000, // Size threshold for enforcing splitting (50KB)

      // Cache groups define how chunks are grouped
      cacheGroups: {
        // Vendor chunks (from node_modules)
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // Test for node_modules directory
          priority: -10, // Higher priority than default
          name: "vendor", // Chunk name for vendor code
          chunks: "all", // Apply to all chunks
          reuseExistingChunk: true, // Reuse existing chunks if possible
        },

        // Common chunks (shared between multiple entry points)
        default: {
          minChunks: 1, // Module must be used in at least 2 chunks
          priority: -20, // Lower priority than vendors
          name: "common", // Chunk name for common code
          reuseExistingChunk: true, // Reuse existing chunks if possible
          chunks: "all", // Apply to all chunks
        },
      },
    },
  },
};
