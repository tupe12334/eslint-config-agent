/**
 * JavaScript File Configurations
 *
 * Handles all JavaScript (.js, .mjs, .cjs) file-specific rules.
 * Plugin registration removed - all plugins registered globally in index.js.
 *
 * The ESM/CommonJS extensions (`.mjs`/`.cjs`) are linted with the same rule set
 * as plain `.js`, mirroring how the TypeScript config covers `.mts`/`.cts`
 * alongside `.ts`. Previously these were ignored here, so `.mjs`/`.cjs` source
 * files silently escaped the package's signature `no-restricted-syntax`,
 * `single-export`, and `required-exports` rules.
 */

import globals from 'globals'

export const javascriptConfig = (sharedRules, sharedRestrictedSyntax) => [
  // JavaScript files (not JSX)
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'pnpm-lock.yaml',
      '**/*.umd.js',
      '**/*.stories.{js,jsx,ts,tsx}',
      '**/rules/**/index.js',
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...sharedRules,
      'single-export/single-export': 'error',
      'required-exports/required-exports': [
        'error',
        {
          variable: false,
          function: false,
          class: true,
          interface: false,
          type: false,
          enum: false,
          ignorePrivate: true,
        },
      ],
      'no-restricted-syntax': ['error', ...sharedRestrictedSyntax],
    },
  },

  // Node.js files (must come after general JS config to override)
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...sharedRules,
      'no-restricted-syntax': ['error', ...sharedRestrictedSyntax],
    },
  },
]
