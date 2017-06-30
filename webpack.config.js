var webpack = require("webpack");

module.exports = [
	{
		entry: "./ts/Controller.ts",

		output: {
			filename: "./js/bundle/game.js",
		},

		module: {
			rules: [
				{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				},
			]
		},

		devtool: "source-map",

		resolve: {
			extensions: [".ts", ".js"]
		},

		plugins: []
	},

	{
		entry: "./ts/Controller.ts",

		output: {
			filename: "./js/bundle/game.min.js",
		},

		module: {
			rules: [
				{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				},
			]
		},

		resolve: {
			extensions: [".ts", ".js"]
		},

		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				minimize: true,
				compress: true
			})
		]
	}
];