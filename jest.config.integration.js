const baseConfig = require('./jest.config');

/**
 * @type {import('jest').Config}
 */
const config = {
  ...baseConfig,
  testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
};

module.exports = config;
