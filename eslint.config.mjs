import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    env: { jest: true },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
]
