import type { Linter } from 'eslint'

/**
 * Incremental adoption preset: the full `eslint-config-agent` ruleset with every
 * error-level rule downgraded to a warning. `eslint` exits `0` so CI stays
 * green while the complete backlog is still reported, letting a team burn it
 * down before flipping back to errors.
 */
declare const config: Linter.Config[]

export default config
