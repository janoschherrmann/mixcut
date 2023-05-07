export default [
  {
    files: ['**/*.js,'],
    ignores: ['node_modules', '**/*.config.js'],
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    languageOptions: {
      ecmaVersion: 5
    }
  }
]
