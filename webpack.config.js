const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const config = {
  entry: "./src/quill-emoji.js",
  output: {
    filename: "quill-emojijs.js",
    path: path.resolve(__dirname, "dist"),
    library: "QuillEmoji",
    libraryTarget: "umd",
    publicPath: "",
  },
  target: "web",
  mode: "production",
  externals: {
    quill: {
      commonjs: "quill",
      commonjs2: "quill",
      amd: "quill",
      root: "Quill",
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sourceMapContents: false,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/i,
        include: /src/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: [
          path.resolve(__dirname, "src/"),
          /\/node_modules\/quill-emoji/,
          /\/node_modules\/parchment/,
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  targets: {
                    browsers: [
                      "last 2 Chrome major versions",
                      "last 2 Firefox major versions",
                      "last 2 Safari major versions",
                      "last 2 Edge major versions",
                      "last 2 iOS major versions",
                      "last 2 ChromeAndroid major versions",
                    ],
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            join_vars: true,
            if_return: true,
          },
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "quill-emoji.css",
      chunkFilename: "[id].css",
    }),
  ],
};

module.exports = config;
