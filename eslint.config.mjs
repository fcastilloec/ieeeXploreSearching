import globals from 'globals';
import js from '@eslint/js';
import nodePlugin from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  importPlugin.flatConfigs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      node: { version: '>=22' },
    },
    rules: {
      'n/no-process-exit': 'off',
    },
  },
  {
    files: ['eslint.config.mjs'], // Or whatever your config file is named
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
];
