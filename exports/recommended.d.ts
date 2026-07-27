import type { Linter } from 'eslint'

/**
 * Recommended (relaxed) preset: the default config with the most divisive rules
 * turned off (spec files, single export, custom `error/*`, optional chaining /
 * nullish-coalescing bans, and so on) for incremental adoption.
 * `max-lines-per-function`/`max-lines` are downgraded to `warn` (same 70/100
 * line thresholds as the strict default) so a real codebase's legacy long
 * functions/files surface as backlog instead of failing CI. Every other
 * surviving rule still reports as an error.
 */
declare const config: Linter.Config[]

export default config
