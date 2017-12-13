const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const uglifyJSPlugin = require('uglifyjs-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const extractCSS = new ExtractTextPlugin({filename: 'style.css', allChunks:true});
module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        extractCSS,
        new uglifyJSPlugin({
            sourceMap: true
        }),
        new cleanWebpackPlugin(['dist'])
    ],
    module: {

        rules: [

            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader', use: 'css-loader?minimize=true'
                })
            }
        ]

    }
});