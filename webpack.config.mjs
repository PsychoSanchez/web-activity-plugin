import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

import tsConfig from './tsconfig.json' with { type: "json" };

const __dirname = path.resolve();

function createWebpackAliasFromTsConfigPaths() {
  return Object.fromEntries(
    Object.entries(tsConfig.compilerOptions.paths || {}).map(
      ([key, [value]]) => [
        key.replace('/*', ''),
        path.resolve(__dirname, value.replace('/*', '')),
      ],
    ),
  );
}

export default (_env, argv) => ({
  entry: {
    background: './src/background.index.ts',
    popup: './src/popup.index.tsx',
    content: './src/content.index.ts',
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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './static', to: './' }],
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: createWebpackAliasFromTsConfigPaths(),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  performance: {
    hints: false,
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000
  },
});
