/**
 * TypeScript File Configurations
 *
 * Handles all TypeScript (.ts) file-specific rules.
 * Plugin registration removed - all plugins registered globally in index.js.
 */

import globals from 'globals'
import allRules from '../rules/index.js'

export const typescriptConfig = (
  sharedRules,
  sharedRestrictedSyntax,
  tsOnlyRestrictedSyntax
) => [
  // TypeScript files - Base config
  {
    files: ['**/*.ts'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'pnpm-lock.yaml',
      '**/*.stories.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      ...sharedRules,
      ...allRules.typescriptEslintRules,
      'no-undef': 'off', // TypeScript handles this
      'custom/no-default-class-export': 'error',
      'single-export/single-export': 'error',
      'required-exports/required-exports': [
        'error',
        {
          variable: false,
          function: false,
          class: true,
          interface: false,
          type: false,
          enum: true,
          ignorePrivate: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        ...sharedRestrictedSyntax,
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },
]
