// Invalid-by-design fixture for `@typescript-eslint/no-use-before-define`.
// Exactly one no-use-before-define violation, no other rule noise (single
// export):
//
// `computeTotal` reads the module-level `let taxRate` before its declaration.
// `taxRate` is hoisted but left uninitialized (the Temporal Dead Zone), so
// this is not a "reads undefined" bug — it is a `ReferenceError` thrown the
// moment `computeTotal` actually runs, even though the file type-checks and
// reads as if `taxRate` were already available.

export const computeTotal = (amount: number): number => amount + amount * taxRate

let taxRate = 0.17
taxRate = 0.18
