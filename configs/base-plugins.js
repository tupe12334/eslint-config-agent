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
  // DDD plugin - index/barrel files must only re-export, never define logic.
  //
  // `require-spec-file` (above) already exempts `index.js`/`index.ts` from the
  // "every source file needs a spec" rule, on the assumption that a barrel
  // file just re-exports the module's public surface and has nothing of its
  // own to test. That assumption silently breaks the moment someone adds a
  // real function, class, or non-trivial `const` to the barrel: the logic now
  // ships with zero test coverage and no rule catches it, because the file's
  // spec-exempt status was never conditional on it staying re-export-only.
  // `ddd/no-logic-in-index` closes that gap directly — it flags any
  // top-level function, class, or function-valued `const` in a file literally
  // named `index.{js,ts,jsx,tsx}`, while still allowing plain re-exports
  // (`export { x } from './x'`, `export * from './y'`) and non-function
  // constants. It ships as part of the `ddd` plugin already bundled here (see
  // `require-spec-file` above), so enabling it adds no new dependency. The rule
  // takes no options, so there is nothing to configure beyond turning it on.
  {
    rules: {
      'ddd/no-logic-in-index': 'error',
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
  // `ddd/no-logic-in-index` assumes `index.{js,ts}` means "barrel file", but
  // this package's own `rules/<rule-name>/index.js` files follow a different,
  // repo-specific convention: `index.js` is each rule's *implementation*
  // entry point (mirroring Node's package-main resolution), not a re-export
  // barrel — e.g. `rules/error-only-exports/index.js` defines the rule's
  // helper functions directly. Consumers' own `index.js` files (the rule's
  // actual target) are unaffected; this exemption only covers this
  // repository's internal rule sources.
  {
    files: ['rules/**/index.js'],
    rules: {
      'ddd/no-logic-in-index': 'off',
    },
  },
]
