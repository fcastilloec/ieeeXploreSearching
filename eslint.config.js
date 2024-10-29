// const js = require('@eslint/js')
const eslintPluginUnicorn = require('eslint-plugin-unicorn');
// const pluginJest = require('eslint-plugin-jest')
const globals = require('globals');

module.exports = [
  eslintPluginUnicorn.configs['flat/recommended'],
  {
    // files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
    },
    rules: {
      "semi": "error",
      "unicorn/no-process-exit": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prefer-top-level-await": "off",
    }
  }
];
