/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/app/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@rn-primitives/.*|class-variance-authority|clsx|tailwind-merge|uniwind|zustand)',
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
};

module.exports = config;
