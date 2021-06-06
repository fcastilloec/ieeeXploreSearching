module.exports = {
  env: {
    node: true,
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb',
  ],
  plugins: [
    'jest',
  ],
  rules: {
    'max-len': ['error', 120],
    'no-console': 'off',
    'no-unused-expressions': ['error', { allowTernary: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
};
