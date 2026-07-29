/**
 * Fixture for the `@typescript-eslint/no-unnecessary-boolean-literal-compare`
 * rule.
 *
 * Both comparisons are against a boolean literal where the operand is already a
 * plain `boolean`, so they are redundant: `=== true` is just the value and
 * `!== false` is just the value. The rule must flag both.
 */
export function describeFlags(enabled: boolean, active: boolean): string {
  if (enabled === true) {
    return 'on'
  }
  if (active !== false) {
    return 'active'
  }
  return 'off'
}
