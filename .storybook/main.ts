import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-essentials',
    '@storybook/addon-styling-webpack',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  // webpackFinal: async (config) => {
  //   const path = require('path');
  //   const __dirname = path.resolve();

  //   return {
  //     ...config,
  //     resolve: {
  //       ...config.resolve,
  //       alias: {
  //         ...config.resolve?.alias,
  //         '@shared': path.resolve(__dirname, '../src/shared'),
  //       },
  //     },
  //   };
  // },
};
export default config;
