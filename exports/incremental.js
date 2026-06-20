/**
 * Incremental adoption preset.
 *
 * Dropping the full strict ruleset onto an existing codebase surfaces a large
 * backlog of pre-existing violations at once, so `eslint` exits non-zero and CI
 * goes red on the very first run. Teams then either give up or copy-paste a
 * helper that rewrites every `error` rule to `warn` — the exact same block,
 * repeated in every repo that adopts this config.
 *
 * This entry point ships that pattern so it no longer has to be copy-pasted:
 *
 * ```js
 * import incremental from 'eslint-config-agent/incremental'
 *
 * export default incremental
 * ```
 *
 * `incremental` is the full `eslint-config-agent` ruleset with every
 * error-level rule downgraded to a warning. `eslint` exits `0`, so `pnpm lint`
 * (and CI) stays green, while the complete ruleset is still reported — letting a
 * team burn the backlog down gradually and flip back to errors once it is clear.
 *
 * To enforce a rule as a hard error before the rest of the backlog is cleared,
 * append your own override layer, which wins over the warned defaults:
 *
 * ```js
 * import incremental from 'eslint-config-agent/incremental'
 *
 * export default [
 *   ...incremental,
 *   { rules: { eqeqeq: ['error', 'always'] } },
 * ]
 * ```
 */

import config from '../index.js'

const WARN = 'warn'
const ERROR_LEVELS = new Set(['error', 2])

const downgrade = severity => (ERROR_LEVELS.has(severity) ? WARN : severity)

/**
 * Downgrade every error-level rule in a flat-config block to a warning.
 *
 * Blocks without a `rules` object (for example `ignores`-only blocks) are
 * returned untouched. Both shorthand (`'error'`) and tuple
 * (`['error', options]`) rule values are handled, and `off`/`warn` rules are
 * left exactly as they are.
 * @param block A flat-config block.
 * @returns The block with error-level rules downgraded to warnings.
 */
const toWarnings = block => {
  if (block.rules === undefined) {
    return block
  }

  const rules = Object.fromEntries(
    Object.entries(block.rules).map(([name, value]) =>
      Array.isArray(value)
        ? [name, [downgrade(value[0]), ...value.slice(1)]]
        : [name, downgrade(value)]
    )
  )

  return { ...block, rules }
}

export default config.map(toWarnings)
