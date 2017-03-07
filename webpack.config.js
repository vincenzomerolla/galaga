const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;


// Common part
const common = {
  entry: [
    './src/scss/style.scss',
    './src/js/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.pug$/, loader: 'pug' },
    ]
  },
}

// For development
if (TARGET === 'start') {
  module.exports = merge(common, {
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        { test: /\.(scss|css)$/, loader: 'style!css!sass' },
        { test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=500000' }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.pug'
      })
    ]
  });
}

// For production
if (TARGET === 'build') {
  module.exports = merge(common, {
    plugins: [
      new ExtractTextPlugin('app.css'),
      new HtmlWebpackPlugin({
        template: './src/index.pug'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    ],
    module: {
      rules: [
        { test: /\.(scss|css)$/, loader: ExtractTextPlugin.extract('style', 'css!sass!postcss') },
        { test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=5000' }
      ]
    },
    postcss: [
      autoprefixer({ browsers: ['last 2 versions'] })
    ]
  });
}
