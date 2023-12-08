const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
			{ from: 'src/mprb-output.json', to: 'mprb-output.json' },
		  ],
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
};
