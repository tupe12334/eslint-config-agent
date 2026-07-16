// These patterns handle nullability explicitly and must NOT be flagged by
// @typescript-eslint/no-non-null-assertion.

// Nullish coalescing — the preferred explicit fallback.
export const safeGet = (x: string | null): string => {
  return x ?? 'default'
}

// Optional chaining — short-circuits on null/undefined without asserting.
export const safeLength = (
  obj: { name?: string } | null
): number | undefined => {
  return obj?.name?.length
}

// Explicit if-guard — narrows the type with a real runtime check.
export const checkedGet = (x: string | null): string => {
  if (x === null) {
    return ''
  }

  return x
}
