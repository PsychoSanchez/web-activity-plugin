const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      }
    ],
  },
  plugins: [
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
