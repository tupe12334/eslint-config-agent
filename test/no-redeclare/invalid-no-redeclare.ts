// Invalid-by-design fixture for `@typescript-eslint/no-redeclare`. Exactly one
// no-redeclare violation, no other rule noise (single export; two top-level
// function declarations sharing the same name):
//
// `helper` is declared twice at module scope. The second declaration silently
// overrides the first — both are legal JavaScript on their own, but together
// the first implementation is unreachable dead code and a reader has no way
// to tell which one `helper()` actually calls without checking declaration
// order.

function helper(): number {
  return 1
}

function helper(): number {
  return 2
}

export const run = (): number => helper()
