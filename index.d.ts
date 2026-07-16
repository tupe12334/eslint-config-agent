import type { Linter } from 'eslint'

/**
 * The default `eslint-config-agent` flat config: the full strict ruleset for
 * TypeScript, React, and Preact projects.
 *
 * It is an array of flat-config blocks, so spread it into (or export it
 * directly as) your `eslint.config.*`:
 *
 * ```ts
 * import config from 'eslint-config-agent'
 *
 * export default config
 * ```
 */
declare const config: Linter.Config[]

export default config
