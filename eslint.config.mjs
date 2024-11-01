import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// Fix for globals, it doesn't allow trailing spaces
globals.browser['AudioWorkletGlobalScope'] =
  globals.browser['AudioWorkletGlobalScope '];
delete globals.browser['AudioWorkletGlobalScope '];

export default [
  {
    // files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['dist/*', 'tools/*', 'node_modules/*', 'static/*'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
    ),
  ),
  {
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },

    plugins: {
      react: fixupPluginRules(react),
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'react-hooks/exhaustive-deps': 'error',
    },
  },
];
