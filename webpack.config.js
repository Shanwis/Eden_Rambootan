const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.jsx',
    dashboard: './src/dashboard.jsx',
    background: './src/background.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: './dashboard.html',
      filename: 'dashboard.html',
      chunks: ['dashboard']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: '.' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: './dist',
    hot: true,
    port: 3000
  }
}; 