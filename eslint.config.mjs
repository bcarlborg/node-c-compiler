import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
          varsIgnorePattern: '_.*',
          argsIgnorePattern: '_.*',
        },
      ],
    },
  },
  pluginJs.configs.recommended,
]
