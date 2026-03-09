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
]);
