const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    mode: 'development',
    entry: {
        app: path.resolve('src/app.js'),
        // vendors: ['ractive','ractivejs-router','jquery','tether', 'bootstrap']
    },

    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },

    devServer: {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 8080,
        devMiddleware: {
          writeToDisk: true
        }
    },

    // module: {
    //     rules: [
    //         {
    //             test: /\.(js|jsx)$/,
    //             exclude: /node_modules/,
    //             loader: 'babel-loader'
    //         },
    //         {
	// 			test: /\.css$/,
	// 			use: ExtractTextPlugin.extract({
	// 				use: "css-loader"
	// 			})
    //         },
    //         {
    //             // you can scope this by directory or using another extension
    //             // using .html for your components gives you good
    //             // syntax highlighting with most editors
    //             test: /\.html$/,
    //             loader: 'ractive-loader'
    //         }
    //     ]
    // },

	plugins: [
		// new ExtractTextPlugin({
		// 	filename: "bundle.css",
		// 	allChunks: true
        // }),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     tether: 'tether',
        //     Tether: 'tether',
        //     'window.Tether': 'tether',
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendors',
        //     filename: 'vendors.js'
        // })
        new CopyWebpackPlugin({
            patterns: [
              { from: "assets", to: "assets" },
              { from: "index.html", to: "" },
            ],
        })
	]
};

module.exports = config;