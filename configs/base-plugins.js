/**
 * Base Plugin Configurations
 *
 * Applies strict configs from error, default, and ddd plugins.
 * These apply globally to all file types.
 */

import { plugins } from '../plugins/index.js'

export const basePluginsConfig = [
  // Error handling plugin strict config
  {
    rules: {
      ...plugins.error.configs.strict.rules,
    },
  },
  // Default plugin strict config
  plugins.default.configs.strict,
  // DDD plugin - require spec files for all source files
  {
    rules: {
      'ddd/require-spec-file': [
        'error',
        {
          excludePatterns: [
            '**/*.spec.js',
            '**/*.spec.ts',
            '**/*.test.js',
            '**/*.test.ts',
            '**/index.js',
            '**/index.ts',
            '**/*.d.ts',
            '**/*.config.js',
            '**/*.config.ts',
            '**/eslint.config.js',
            '**/*.stories.{js,jsx,ts,tsx}',
            // Common error file patterns
            // Note: For files that only export Error classes but don't follow
            // naming conventions, add: /* eslint-disable ddd/require-spec-file */
            '**/*-error.{js,ts}',
            '**/*.error.{js,ts}',
            '**/errors/**',
            '**/exceptions/**',
          ],
        },
      ],
    },
  },
  // Require spec files for .tsx/.jsx source files too.
  //
  // `ddd/require-spec-file` only inspects `.js`/`.ts` files, so React/Preact
  // components — the code this config primarily targets — were silently exempt
  // from the spec requirement. This custom rule covers the JSX extensions with
  // the same heuristic, completing the "spec file for every source file"
  // promise. Its excludePatterns mirror the JSX-relevant entries of the `ddd`
  // list above (index/stories files are exempt; the error/exception file
  // patterns are exempt; `.spec`/`.test` files are skipped by the rule
  // itself).
  {
    rules: {
      'custom/require-spec-file-tsx': [
        'error',
        {
          excludePatterns: [
            '**/index.tsx',
            '**/index.jsx',
            '**/*.stories.{tsx,jsx}',
            // Mirror the ddd error/exception exemptions for JSX extensions so
            // an error component (e.g. an error boundary) is not singled out
            // for a spec file when its `.ts` equivalent is exempt.
            '**/*-error.{tsx,jsx}',
            '**/*.error.{tsx,jsx}',
            '**/errors/**',
            '**/exceptions/**',
          ],
        },
      ],
    },
  },
  // Disable DDD for config infrastructure files
  {
    files: [
      'configs/**/*.js',
      'plugins/**/*.js',
      'exports/**/*.js',
      'scripts/**/*.js',
      'rules/**/examples/**/*',
      'rules/**/*.spec.js',
      'rules/**/*.spec.ts',
      'test/**/*',
    ],
    rules: {
      'ddd/require-spec-file': 'off',
      'custom/require-spec-file-tsx': 'off',
    },
  },
]
