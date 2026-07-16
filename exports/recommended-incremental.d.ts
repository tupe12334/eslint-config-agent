import type { Linter } from 'eslint'

/**
 * Recommended + incremental preset: the `recommended` config with every
 * surviving error-level rule downgraded to a warning. The gentlest on-ramp —
 * the noisiest rules are off and everything else warns, so `eslint` exits `0`
 * while the remaining backlog is still reported.
 */
declare const config: Linter.Config[]

export default config
