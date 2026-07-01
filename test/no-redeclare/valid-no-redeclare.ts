// Valid fixture for `@typescript-eslint/no-redeclare`: the mirror of the
// invalid file. Two top-level function declarations with distinct names, so
// there is no name collision for the rule to flag. Single export, no other
// rule noise.

function double(value: number): number {
  return value * 2
}

function triple(value: number): number {
  return value * 3
}

export const run = (): number => double(triple(1))
