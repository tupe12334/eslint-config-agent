import type { Linter } from 'eslint'

/**
 * Downgrade every error-level rule in a single flat-config block to a warning.
 *
 * This is the same helper the `eslint-config-agent/incremental` and
 * `eslint-config-agent/recommended-incremental` presets use internally. It is
 * exported so a project that composes its own flat config can warn-level the
 * shared ruleset while still layering hard errors on top — without copy-pasting
 * the downgrade logic:
 *
 * ```js
 * import config from 'eslint-config-agent'
 * import { toWarnings } from 'eslint-config-agent/to-warnings'
 *
 * export default [
 *   ...config.map(toWarnings),
 *   // Rules you are ready to enforce as hard errors today win over the warnings above:
 *   { rules: { eqeqeq: ['error', 'always'] } },
 * ]
 * ```
 *
 * Blocks without a `rules` object (for example `ignores`-only blocks) are
 * returned untouched. Both shorthand (`'error'`) and tuple (`['error', options]`)
 * rule values are handled; `off`/`warn` rules are left exactly as they are.
 * @param block A flat-config block.
 * @returns The block with its error-level rules downgraded to warnings.
 */
export declare const toWarnings: (block: Linter.Config) => Linter.Config
