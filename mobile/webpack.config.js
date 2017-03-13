/**
 * Created by sunlong on 16/1/27.
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
    // path.resolve(__dirname,'/svg'),  // 2. 自己私人的 svg 存放目录
];
module.exports = {
    entry: {
        mobile:['./src/index.js'],
    },
    output: { path: __dirname+"/dist", filename: 'js/[name].js', publicPath:"/" },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: [{ loader: 'babel-loader' }],
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
        }, {
            test: /\.(jpg|png|gif)$/,
            use: ['file-loader?name=images/[name].[ext]'],
        }, {
            test: /\.(eot|woff|woff2|ttf)$/,
            use: ['file-loader?name=fonts/[name].[ext]'],
        },{
            test: /\.(svg)$/i,
            use: [{ loader: 'svg-sprite-loader'}],
        }],
    },
	resolve: {
       modules: ['node_modules', path.join(__dirname, '../node_modules')],
       extensions: ['.web.js', '.js', '.json'],
    },
    plugins: [
        new ExtractTextPlugin({ filename: 'css/[id].css' }),
        new HtmlWebpackPlugin({
            chunks:['mobile'],
            filename:'index.html',
            template: path.join(__dirname,"/index-tmpl.html")
        }),
        new CopyWebpackPlugin([{ from: 'lib/*', to: './' }]),
    ],
    externals: { //全局引用
    },
    devtool: "#source-map"
};