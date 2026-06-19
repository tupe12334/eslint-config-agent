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
    // Don't require a semantic `className` on every HTML element, and don't
    // reject Tailwind-only class lists. The strict default enables
    // `jsx-classname/require-classname` with `{ ignoreTailwind: true }`, which
    // errors both on elements with no `className` and on elements whose
    // `className` contains only Tailwind utilities (e.g.
    // `<div className="flex gap-2" />`). That makes the config impossible to
    // adopt incrementally in any React/Preact + Tailwind codebase — by far the
    // most common modern setup — so relax it for the recommended preset.
    'jsx-classname/require-classname': 'off',
    // The most divisive layer: this is where optional chaining (`?.`),
    // nullish coalescing (`??`), type assertions and switch-default bans live.
    // Relaxing it lets idiomatic TypeScript through during adoption.
    'no-restricted-syntax': 'off',
  },
}

export default [...config, relaxedOverrides]
