// Fixture for @typescript-eslint/no-unnecessary-condition.
//
// `value` is typed as a non-nullable object, so the guard can never be
// falsy — the type checker has already proven the condition is always true,
// making the "guard" dead code that hides a stale null check.

interface Config {
  name: string
}

export function describe(value: Config): string {
  if (value) {
    return value.name
  }
  return 'unknown'
}
