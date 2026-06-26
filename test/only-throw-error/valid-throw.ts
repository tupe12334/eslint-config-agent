// Valid-by-design fixture for `@typescript-eslint/only-throw-error`.
// Throwing a real Error instance must not be flagged.

/** Throws a proper Error — carries a stack trace and `.message`. */
export const throwError = (): never => {
  throw new Error('something went wrong')
}

/** Re-throws a caught Error — also acceptable. */
export const rethrow = (): never => {
  try {
    throw new Error('inner')
  } catch (error) {
    throw error
  }
}
