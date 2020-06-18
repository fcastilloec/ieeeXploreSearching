module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'airbnb',
  ],
  rules: {
    'max-len': ['error', 120],
    'no-console': 'off',
    'no-unused-expressions': ['error', { allowTernary: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
};
