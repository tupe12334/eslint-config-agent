/**
 * Fixture for the `@typescript-eslint/no-unnecessary-boolean-literal-compare`
 * rule.
 *
 * `enabled` is used directly (no literal comparison), and `maybeActive` is a
 * nullable boolean (the optional parameter widens it to `boolean | undefined`)
 * compared to `=== true`, which is a genuine narrowing the rule deliberately
 * allows by default. Neither should be flagged.
 */
export function describeFlags(enabled: boolean, maybeActive?: boolean): string {
  if (enabled) {
    return 'on'
  }
  if (maybeActive === true) {
    return 'active'
  }
  return 'off'
}
