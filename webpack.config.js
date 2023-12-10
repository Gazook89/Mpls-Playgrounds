const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    mode: 'development', // or 'production'
	entry: './src/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		hot: true,
	},
	plugins: [
		new CopyWebpackPlugin({
		  patterns: [
			{ from: 'src/index.html', to: 'index.html' },
			{ from: 'src/css/styles.css', to: 'css/styles.css' },
			{ from: 'data', to: 'data' }, 
		  ],
		}),
		new Dotenv(),
		new webpack.DefinePlugin({
            'MAPBOX_API_TOKEN': JSON.stringify(process.env.MAPBOX_API_TOKEN),
        }),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		fallback: {
			os: require.resolve('os-browserify/browser'),
			crypto: require.resolve('crypto-browserify'),
			path: require.resolve('path-browserify'),
			stream: require.resolve('stream-browserify')
		},
	},
};
