import { noExplicitAnyConfig } from './no-explicit-any/index.js'

export const typescriptEslintRules = {
  ...noExplicitAnyConfig,
  '@typescript-eslint/consistent-type-assertions': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  // Require a compare function when sorting anything that is not an array of
  // strings. `Array.prototype.sort` (and `toSorted`) coerce every element to a
  // string and compare the UTF-16 code units, so `[10, 2, 1].sort()` yields
  // `[1, 10, 2]` and `[2, 1, 10].toSorted()` yields `[1, 10, 2]` — the numbers
  // come back in the wrong order. This is a silent correctness bug the type
  // checker cannot catch (the call is perfectly typed) and exactly the kind of
  // shortcut an AI assistant emits when it reaches for `.sort()` on a numeric
  // array, which puts it squarely in scope for this config's
  // explicit-over-clever, bug-prevention stance. `ignoreStringArrays: true`
  // keeps the rule silent on `string[]` (where the default lexicographic order
  // is what the author wants), so it only fires on the cases that are actually
  // wrong and carries near-zero false-positive cost. It is type-aware, hence it
  // lives in the TypeScript-only rule set rather than `sharedRules`.
  '@typescript-eslint/require-array-sort-compare': [
    'error',
    { ignoreStringArrays: true },
  ],
}
