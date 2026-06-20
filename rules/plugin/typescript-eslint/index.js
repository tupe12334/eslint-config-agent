import { noExplicitAnyConfig } from './no-explicit-any/index.js'

export const typescriptEslintRules = {
  ...noExplicitAnyConfig,
  '@typescript-eslint/consistent-type-assertions': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  // Require a `case` for every member of the union/enum a `switch` discriminates
  // on. This is the type-aware completion of the `no-restricted-syntax` ban on
  // `default` cases this config already ships ("Default cases are not allowed in
  // switch statements. Handle all possible cases explicitly."): banning the
  // catch-all only matters if something then proves the remaining cases are
  // actually exhaustive. Without this rule a `switch` over a string-literal
  // union or enum can silently miss a member — the missing branch just falls
  // through to nothing — and, crucially, adding a new member to the union later
  // does NOT flag the now-incomplete switch, so the bug ships unnoticed. That
  // silent-fallthrough-on-extension footgun is exactly the kind of mistake AI
  // assistants introduce when they widen a union but forget a call site. With
  // the rule on, the omission is a compile-time-shaped error pointing at the
  // exact missing member.
  //
  // `requireDefaultForNonUnion: false` keeps it aligned with the default-case
  // ban: switches over open types like `number`/`string` are not forced to add
  // the `default` branch this config forbids. `allowDefaultCaseForExhaustiveSwitch`
  // is left at its default (`true`) so the rule never fights that ban. The rule
  // is type-aware and runs under the `projectService` parser options already
  // configured for `.ts`/`.tsx` files.
  '@typescript-eslint/switch-exhaustiveness-check': [
    'error',
    {
      requireDefaultForNonUnion: false,
    },
  ],
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
  // Force `import type { ... }` for imports used only as types. A type-only
  // import is erased at compile time, so writing it as a value import leaves a
  // binding that looks like a runtime dependency: it can pull a module (and its
  // side effects) into the emitted JS even though nothing actually uses the
  // value, and it breaks under TypeScript's `verbatimModuleSyntax` /
  // `isolatedModules`. Making the type/value split explicit keeps the emitted
  // graph honest and the intent of every import legible — squarely in line with
  // this config's explicit-over-clever stance. It is exactly the distinction an
  // AI assistant blurs when it merges a type and a value into one import line.
  // The rule is auto-fixable (`eslint --fix`), so adoption is cheap; this is
  // why several downstream repos already re-add it by hand on top of the base
  // config. `fixStyle: 'separate-type-imports'` keeps type and value imports on
  // distinct statements rather than the inline `import { type X }` form.
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
  ],
}
