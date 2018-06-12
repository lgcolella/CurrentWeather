const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcFold = 'src';
const distFold = 'dist';

module.exports = {

    entry: {
        app: path.resolve(__dirname, srcFold, 'app.js')
    },

    output: {
        path: path.resolve(__dirname, distFold),
        filename: '[name].js'
    },

    devServer: {
        contentBase: path.resolve(__dirname, distFold),
        compress: true,
        port: 8080,
        headers: {
            "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },

    module: {
        rules: [
            { 
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: ["style-loader",  "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader",  "css-loader"]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'CurrentWeather',
            template: path.resolve(__dirname, srcFold, 'index.html'),
            minify: true
        })
    ]

}