export default [{
  files: ['**/*.js'],
  ignores: ['build/**', 'dist/**'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: { ARGV: 'readonly' },
  },
  rules: {
    'no-unused-vars': ['error', {argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_'}],
    'no-undef': 'error',
    'no-trailing-spaces': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }]
  }
}];
