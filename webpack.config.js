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
				{
					test: /\.(frag|vert)$/,
					loader: 'raw-loader',
					include: /shader/
				}
			]
		},

		devtool: "source-map",
		performance: {
			hints: "warning"
		},

		resolve: {
			extensions: [".ts", ".js", ".frag", ".vert"]
		}
	},

	/*{
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
				{
					test: /\.(frag|vert)$/,
					loader: 'raw-loader',
					include: /shader/
				}
			],

			loaders: [
				{ test: /\.js$/, loader: "webpack-unassert-loader" }
			]
		},

		resolve: {
			extensions: [".ts", ".js", ".frag", ".vert"]
		},

		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				minimize: true,
				compress: true
			})
		]
	}*/
];