// These patterns use the non-null assertion operator (`!`) and must be flagged
// by @typescript-eslint/no-non-null-assertion.

// Postfix `!` on a nullable variable — the classic "trust me" lie to the
// compiler that crashes at runtime when the value is actually null.
export const getValue = (x: string | null): string => {
  return x!
}

// `!` chained on a property access — silences two separate "possibly undefined"
// errors in one expression, doubling the runtime risk.
export const getLength = (obj: { name: string | null } | null): number => {
  return obj!.name!.length
}
