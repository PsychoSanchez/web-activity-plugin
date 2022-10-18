const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => ({
  entry: {
    content: './src/content.index.tsx',
    background: './src/background.index.ts',
    popup: './src/popup.index.tsx',
  },
  devtool: argv.mode === 'development' ? 'inline-source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Configuration for webpack to process CSS with PostCSS and export the result as a single CSS file.
      {
        test: /\.css$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          // {

          //   loader: 'css-loader',
          //   options: {
          //     modules: true,
          //     importLoaders: 1,
          //     sourceMap: true
          //   },
          // },
          'postcss-loader',
        ],
      }
    ],
  },
  plugins: [
    // new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [{ from: './static', to: './' }],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
});
