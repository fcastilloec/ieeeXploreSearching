const config = {
  testTimeout: process.env.CI ? 45000 : 25000,
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  collectCoverageFrom: ['src/lib/*.mjs'],
  coveragePathIgnorePatterns: [
    'src/lib/api-key.mjs',
    'src/lib/config-directory.mjs',
    'src/lib/create-json.mjs',
    'src/lib/ieee-api.mjs',
  ],
  testMatch: ['**/test/**/*.mjs'],
};

export default config;
