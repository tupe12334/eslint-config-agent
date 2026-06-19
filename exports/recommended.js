/**
 * Recommended (relaxed) preset.
 *
 * The default export is intentionally strict — it is tuned for greenfield
 * projects that adopt every convention from day one (a spec file beside every
 * source file, custom Error classes, no optional chaining / nullish
 * coalescing, single export per module, and so on).
 *
 * Existing codebases usually cannot satisfy all of that at once, so they end
 * up copying the same block of rule overrides into their own
 * `eslint.config.js` just to get the config to load without a wall of errors.
 *
 * This preset bundles those common overrides so incremental adopters can opt
 * into the core quality rules immediately while deferring the most opinionated
 * ones:
 *
 * ```js
 * import recommended from 'eslint-config-agent/recommended'
 *
 * export default recommended
 * ```
 *
 * Re-enable any individual rule by appending your own override layer.
 */

import config from '../index.js'

const relaxedOverrides = {
  name: 'eslint-config-agent/recommended-overrides',
  rules: {
    // Don't require a `*.spec.*` file alongside every source file.
    'ddd/require-spec-file': 'off',
    // Allow multiple exports per module.
    'single-export/single-export': 'off',
    'required-exports/required-exports': 'off',
    // Allow generic `Error` instead of mandating custom Error classes.
    'error/no-generic-error': 'off',
    'error/require-custom-error': 'off',
    'error/no-literal-error-message': 'off',
    // Allow default parameter values.
    'default/no-default-params': 'off',
    // Allow `type` aliases, not just `interface` declarations.
    '@typescript-eslint/consistent-type-definitions': 'off',
    // The most divisive layer: this is where optional chaining (`?.`),
    // nullish coalescing (`??`), type assertions and switch-default bans live.
    // Relaxing it lets idiomatic TypeScript through during adoption.
    'no-restricted-syntax': 'off',
    // Downgrade the function/file length limits from `error` to `warn`. The
    // strict default promotes these to hard errors (>70 lines per function,
    // >100 lines per file) in its final override layer, which is one of the
    // largest sources of failures when pointing this config at an existing
    // codebase: long legacy functions and files cannot be split safely in a
    // single adoption pass. Keeping them as warnings preserves the signal — the
    // limits still surface in `eslint` output and can be burned down over time —
    // without breaking a `pnpm lint` / CI run that treats errors as fatal. The
    // thresholds (70 / 100) are kept identical to the strict config; only the
    // severity changes. Re-enable as errors with your own override layer once
    // the backlog is cleared.
    'max-lines-per-function': [
      'warn',
      { max: 70, skipBlankLines: true, skipComments: true },
    ],
    'max-lines': [
      'warn',
      { max: 100, skipBlankLines: true, skipComments: true },
    ],
  },
}

export default [...config, relaxedOverrides]
