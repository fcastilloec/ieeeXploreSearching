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
  { ignores: ['build/'] },
  {
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^fs-extra/esm$'] }],
    },
    settings: {
      node: { version: '>=22' },
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2024,
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
