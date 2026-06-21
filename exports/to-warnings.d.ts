import type { Linter } from 'eslint'

/**
 * Downgrade every error-level rule in a flat-config block to a warning.
 *
 * The single source of truth used internally by the
 * `eslint-config-agent/incremental` and
 * `eslint-config-agent/recommended-incremental` presets. Map it over a
 * flat-config array to warn-level the shared ruleset while composing your own
 * config — for example to keep a handful of rules as hard errors from day one
 * without copy-pasting the downgrade logic by hand.
 *
 * Blocks without a `rules` object (for example `ignores`-only blocks) are
 * returned untouched. Both shorthand (`'error'`) and tuple (`['error',
 * options]`) rule values are handled, and `off`/`warn` rules are left exactly
 * as they are.
 * @param block A flat-config block.
 * @returns The block with error-level rules downgraded to warnings.
 */
export declare const toWarnings: (block: Linter.Config) => Linter.Config
