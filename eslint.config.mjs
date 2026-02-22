import globals from 'globals';
import js from '@eslint/js';
import nodePlugin from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  nodePlugin.configs['flat/recommended-module'],
  importPlugin.flatConfigs.recommended,
  { ignores: ['build/'] },
  {
    settings: {
      n: { version: '>=24' },
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'n/no-process-exit': 'off',
    },
  },
  {
    files: ['eslint.config.mjs', 'bin/build-pkg.mjs'],
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
  eslintConfigPrettier,
];
