var webpack = require("webpack");

// webpack -p does not seem to set this up correctly :/
var debug = process.env.NODE_ENV !== "production";

console.log(debug ? "DEBUG mode!" : "PRODUCTION!");

module.exports = [
	{
		entry: "./ts/Controller.ts",

		output: {
			filename: debug ? "./js/bundle/game.min.js": "./js/bundle/game.js",
		},

		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(frag|vert)$/,
					loader: 'raw-loader',
					include: /shader/
				}
			]
		},

		performance: {
			hints: "warning"
		},

		resolve: {
			extensions: [".ts", ".js", ".frag", ".vert"]
		},

		plugins: debug ? [] : [
			new webpack.optimize.UglifyJsPlugin({
				comments: false,
				compress: {
					// remove warnings
					warnings: false,

					// Drop console statements
					drop_console: true
				}
			})
		]
	}
];