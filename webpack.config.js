const path = require('path');
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const StylelintWebpackPlugin = require("stylelint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.ttf$/,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
            }
        ]
    },
    output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, 'public'),
        clean: true
    },
    plugins: [
        new ESLintWebpackPlugin(),
        new StylelintWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Daily Jumba'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        })
    ],
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            `...`,
            new CssMinimizerWebpackPlugin()
        ]
    },
    resolve: {
        alias: {
            marionette: 'backbone.marionette',
            underscore: 'lodash'
        },
        fallback: {
            fs: false
        }
    }
}
