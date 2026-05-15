const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./demo/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.m?js/, resolve: { fullySpecified: false } },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./demo/index.html" }),
  ],
  devServer: {
    static: path.resolve(__dirname),
    port: 8091,
    open: true,
  },
};
