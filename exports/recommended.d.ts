import type { Linter } from 'eslint'

/**
 * Recommended (relaxed) preset: the default config with the most divisive rules
 * turned off (spec files, single export, custom `error/*`, optional chaining /
 * nullish-coalescing bans, and so on) for incremental adoption. Every surviving
 * rule still reports as an error.
 */
declare const config: Linter.Config[]

export default config
