module.exports = {
  // Uses the ts-jest preset to transform test files
  preset: 'ts-jest',

  testURL: 'http://localhost',

  // Allow these file extensions to be omitted in import statements
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],

  // The code Jest counts when measuring coverage
  collectCoverageFrom: ['<rootDir>/src/**/*.[jt]s?(x)'],

  // Specifies the maximum number of workers the worker-pool will spawn for running tests.
  // Available cores for CI are 4, with a total of 36. Defaults to cores available minus one.
  maxWorkers: process.env.CI ? 4 : 0,

  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/test/**/*.[jt]s?(x)', '<rootDir>/**/*.test.[jt]s?(x)'],

  // Initialization code to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],

  // Run tests in JSDOM by default; use /** @jest-environment node */ docblock to override
  testEnvironment: 'jsdom',
};
