// Invalid-by-design fixture for `@typescript-eslint/only-throw-error`.
// Each of these throw statements must be flagged by the type-aware rule.

/** Throws a string literal — no stack trace, no `.message`. */
export const throwString = (): never => {
  throw 'boom'
}

/** Throws a plain object — loses Error identity and stack trace. */
export const throwObject = (): never => {
  throw { code: 500, message: 'server error' }
}
