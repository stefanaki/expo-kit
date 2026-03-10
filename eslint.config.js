const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'coverage/**',
      'android/**',
      'ios/**',
      '.agents/**',
      'uniwind-types.d.ts',
    ],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    files: [
      'jest.setup.js',
      '**/__tests__/**/*.{js,ts,tsx}',
      '**/*.test.{js,ts,tsx}',
      '**/*.spec.{js,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
]);
