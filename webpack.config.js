const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const package = require("./package.json");
const webpack = require("webpack");

module.exports = {
	entry: "./src/index.ts",
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: "sourcemaps/[file].map",
		}),
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: true,
			publicPath: "http://127.0.0.1:5500/dist/",
			fileContext: "public",
		}),
		new HtmlWebpackPlugin({
			hash: true,
			filename: "index.html",
			template: "index.html",
		}),
	],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	resolve: { extensions: [".js", ".ts", "tsx"] },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.[sc]css$/,
				use: [
					"style-loader",
					"css-loader",
					{ loader: "sass-loader", options: { implementation: require("sass") } },
				],
			},
		],
	},
};
