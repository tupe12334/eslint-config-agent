/**
 * Invalid fixture for `@typescript-eslint/strict-boolean-expressions`
 * (see rules/plugin/typescript-eslint/index.js).
 *
 * Every condition below puts a *nullable* value directly in a boolean
 * position, which is exactly the ambiguous coercion the rule flags: the falsy
 * branch silently collapses "present but empty/zero" together with "missing".
 * The rule is type-aware, so this must be a real on-disk file the TypeScript
 * project service can resolve.
 */
const sample = (maybe: string | undefined, count: number | null): string => {
  // nullable string in an `if` test
  if (maybe) {
    return maybe
  }

  // nullable number in a `&&` operand
  const doubled = count && count * 2

  // nullable number as a ternary test
  return doubled ? String(doubled) : 'none'
}

export { sample }
