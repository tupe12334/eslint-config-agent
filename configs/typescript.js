/**
 * TypeScript File Configurations
 *
 * Handles all TypeScript (.ts, .mts, .cts) file-specific rules.
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
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
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
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
      // Tell eslint-plugin-import to parse TypeScript dependency files with the
      // TS parser. Without this, the resolver finds the file but the plugin
      // cannot read its imports/exports, so cross-file rules like
      // import/no-cycle silently never fire on .ts/.tsx code.
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts'],
      },
    },
    rules: {
      ...sharedRules,
      ...allRules.typescriptEslintRules,
      'no-undef': 'off', // TypeScript handles this
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ClassDeclaration: true,
            FunctionDeclaration: true,
          },
        },
      ],
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
