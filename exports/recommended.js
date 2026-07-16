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
import { noProcessEnvironmentPropertiesConfig } from '../rules/no-process-env-properties/index.js'
import { errorOptions as maxFunctionLinesErrorOptions } from '../rules/max-function-lines/index.js'
import { errorOptions as maxFileLinesErrorOptions } from '../rules/max-file-lines/index.js'
import { lengthRuleFileMatch } from '../configs/length-rule-scope.js'

const relaxedOverrides = {
  name: 'eslint-config-agent/recommended-overrides',
  rules: {
    // Don't require a `*.spec.*` file alongside every source file. The strict
    // default splits this requirement across two rules: `ddd/require-spec-file`
    // covers `.js`/`.ts` (the upstream `eslint-plugin-ddd` rule bails out on any
    // other extension), and the bundled `custom/require-spec-file-tsx` covers
    // `.tsx`/`.jsx` — i.e. the React/Preact components this config primarily
    // targets. Relaxing only the first would still force a spec file beside
    // every component, defeating the preset's purpose for its core audience, so
    // both halves are disabled together here.
    'ddd/require-spec-file': 'off',
    'custom/require-spec-file-tsx': 'off',
    // Allow multiple exports per module.
    'single-export/single-export': 'off',
    'required-exports/required-exports': 'off',
    // Allow generic `Error` instead of mandating custom Error classes.
    'error/no-generic-error': 'off',
    'error/require-custom-error': 'off',
    'error/no-literal-error-message': 'off',
    // Don't require a JSDoc block on every exported function and class. The
    // strict default enables `jsdoc/require-jsdoc` at `error` for every
    // `FunctionDeclaration` and `ClassDeclaration` (see `index.js` and
    // `configs/typescript.js`), so adopting the config on an existing codebase
    // produces a wall of `Missing JSDoc comment` errors on day one. This is the
    // third of the three highest-volume on-ramp rules the README calls out —
    // alongside `ddd/require-spec-file` and `error/no-literal-error-message`,
    // both already relaxed above — so relax it here to match the preset's
    // stated incremental-adoption purpose. Only the "document everything"
    // requirement is lifted: the jsdoc *content* rules (`check-param-names`,
    // `require-returns`, ...) stay enabled, so any JSDoc that is actually
    // written is still validated.
    'jsdoc/require-jsdoc': 'off',
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
    // The most divisive layer: optional chaining (`?.`), nullish coalescing
    // (`??`), type assertions, switch-default bans, and inline union/record
    // type restrictions. Removing them lets idiomatic TypeScript through during
    // adoption. The process.env guard (`no-process-env-properties`) is NOT in
    // this group: scattered `process.env.FOO` access is a configuration smell
    // regardless of adoption stage, so it is kept as the one surviving
    // no-restricted-syntax check.
    'no-restricted-syntax': ['error', noProcessEnvironmentPropertiesConfig],
  },
}

// The strict default promotes function/file length to hard errors in its
// final override layer (`configs/overrides.js`'s "Function and file length
// rules" block) — at >70 lines per function and >100 lines per file — which
// blocks incremental adoption: an existing codebase pointing `recommended` at
// its real source tree still gets fatal errors on every long legacy
// function/file, exactly the "wall of errors" this preset exists to avoid
// (see issue #85). Downgrade both to `warn` while keeping the same 70/100
// thresholds — and the same file scope (`lengthRuleFileMatch`, shared with
// the strict block) — so the signal still surfaces in `eslint` output and the
// backlog can be burned down, but it no longer fails a CI run that treats
// errors as fatal. Consumers can re-enable these as errors with their own
// override layer once they are ready.
const lengthWarningOverrides = {
  name: 'eslint-config-agent/recommended-length-warnings',
  ...lengthRuleFileMatch,
  rules: {
    'max-lines-per-function': ['warn', maxFunctionLinesErrorOptions],
    'max-lines': ['warn', maxFileLinesErrorOptions],
  },
}

export default [...config, relaxedOverrides, lengthWarningOverrides]
