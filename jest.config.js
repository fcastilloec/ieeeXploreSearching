const config = {
  testTimeout: process.env.CI ? 45000 : 25000,
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  collectCoverageFrom: ['src/lib/*.js'],
  coveragePathIgnorePatterns: [
    'src/lib/api-key.js',
    'src/lib/config-directory.js',
    'src/lib/constants.js',
    'src/lib/create-json.js',
    'src/lib/ieee-api.js',
  ],
};

module.exports = config;
