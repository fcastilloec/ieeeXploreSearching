const config = {
  testTimeout: 20000,
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  collectCoverageFrom: [
    'src/lib/*.js',
  ],
  coveragePathIgnorePatterns: [
    'src/lib/apiKey.js',
    'src/lib/configDirectory.js',
    'src/lib/constants.js',
    'src/lib/createJson.js',
    'src/lib/ieeeAPI.js',
  ],
};

module.exports = config;
