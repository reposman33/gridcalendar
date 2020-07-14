const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const package = require("./package.json");

module.exports = {
	entry: "./src/index.js",
	plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
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
	resolve: { extensions: [".js", ".ts"] },
	module: {
		rules: [
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
