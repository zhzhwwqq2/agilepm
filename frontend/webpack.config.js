/**
 * Created by sunlong on 16/1/27.
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        front:['./js-src/index.js'],
        dashboard:['./js-src/main.js']
    },
    output: { path: __dirname+"/js", filename: '[name].js', publicPath:"/js/" },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }, {
            test: /\.(jpg|png|gif)$/,
            loader: "file?name=images/[name].[ext]"
        },{
            test: /\.(eot|woff|woff2|ttf|svg)$/,
            loader: "file?name=fonts/[name].[ext]"
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                // NODE_ENV: JSON.stringify("development")
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new ExtractTextPlugin("../css/[id].css"),
        // new CleanWebpackPlugin(['*.js', '*.map'], {
        //     root: path.join(__dirname,"/js"),
        //     verbose: true,
        //     dry: false
        // }),
        new HtmlWebpackPlugin({
            chunks:['front'],
            filename:'../index.html',
            template: path.join(__dirname,"/index-tmpl.html")
        }),
        new HtmlWebpackPlugin({
            chunks:['dashboard'],
            filename:'../dashboard.html',
            template: path.join(__dirname,"/dashboard-tmpl.html")
        }),
    ],
    externals: { //全局引用
    },
    devtool: "#source-map"
};