/* eslint-disable linebreak-style */
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
  mode: process.argv.includes('--production') ? 'production' : 'development',
  entry: {
    index: './src/assets/scripts/index-app.js',
    portfolio: './src/assets/scripts/portfolio.js',
    press: './src/assets/scripts/gulp-modules/press.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: 'defaults',
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      }
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks(chunk) {
            // exclude `my-excluded-chunk`
            return chunk.name !== 'immediate-loading';
          },
        },
      },
    },
  },
};

module.exports = config;
