// Idiomatic TypeScript that the strict default config rejects but the
// relaxed `recommended` preset accepts. Exercises optional chaining, nullish
// coalescing, a default parameter, a generic Error, and multiple exports —
// all in a file with no sibling spec file.

export type Maybe = { value?: string }

export function describe(input?: Maybe, fallback = 'none'): string {
  const value = input?.value ?? fallback
  if (value.length === 0) {
    throw new Error('value must not be empty')
  }
  return value
}
