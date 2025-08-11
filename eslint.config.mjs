import globals from 'globals';
import js from '@eslint/js';
import nodePlugin from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import babelParser from '@babel/eslint-parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  importPlugin.flatConfigs.recommended,
  { ignores: ['build/'] },
  {
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^fs-extra/esm$'] }],
    },
    settings: {
      node: { version: '>=24' },
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        requireConfigFile: false,
        babelOptions: {
          // Tell Babel to specifically enable the import attributes plugin
          plugins: ['@babel/plugin-syntax-import-attributes'],
        },
      },
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
    files: ['eslint.config.mjs'],
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
  eslintConfigPrettier,
];
