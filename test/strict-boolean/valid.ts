/**
 * Valid fixture for `@typescript-eslint/strict-boolean-expressions`
 * (see rules/plugin/typescript-eslint/index.js).
 *
 * The same logic as the invalid fixture, but every nullable value is compared
 * explicitly against `undefined`/`null`/`0` before it reaches a boolean
 * position, so the rule must stay silent.
 */
const sample = (maybe: string | undefined, count: number | null): string => {
  if (maybe !== undefined) {
    return maybe
  }

  const doubled = count !== null ? count * 2 : 0

  return doubled !== 0 ? String(doubled) : 'none'
}

export { sample }
