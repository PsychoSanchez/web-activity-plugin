import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-essentials',
    '@storybook/addon-styling-webpack',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const tsConfig = require('../tsconfig.json');
    const __dirname = path.resolve();

    function createWebpackAliasFromTsConfigPaths() {
      return Object.fromEntries(
        Object.entries<[string, string[]]>(
          tsConfig.compilerOptions.paths || {},
        ).map(([key, [value]]) => [
          key.replace('/*', ''),
          path.resolve(__dirname, value.replace('/*', '')),
        ]),
      );
    }

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          ...createWebpackAliasFromTsConfigPaths(),
        },
      },
    };
  },
};
export default config;
