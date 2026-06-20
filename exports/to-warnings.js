/**
 * Shared severity-downgrade helper for the warn-level adoption presets.
 *
 * Both `eslint-config-agent/incremental` and
 * `eslint-config-agent/recommended-incremental` need to take a built flat-config
 * array and rewrite every error-level rule to a warning so `eslint` exits `0`
 * while still reporting the full backlog. That logic lived inline in
 * `incremental.js`; extracting it here keeps a single source of truth so the two
 * presets cannot drift apart.
 */

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
export const toWarnings = block => {
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
