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
  // Forbid the non-null assertion operator (`value!`). A `!` silently tells the
  // compiler "trust me, this is never null/undefined" and is then erased at
  // build time, so a wrong assumption does not fail at the assertion — it
  // surfaces far away as a runtime "Cannot read properties of undefined" crash,
  // often inside a *consumer's* app. That is the exact failure mode the type
  // system exists to prevent, and `!` is the one operator that opts out of it
  // with zero runtime guard. Forcing an explicit narrowing instead (a
  // `if (x == null) throw`, a `?? fallback`, or a real type guard) keeps the
  // null-safety guarantee honest and the failure loud and local. It is exactly
  // the shortcut an AI assistant reaches for to silence a "possibly undefined"
  // error without handling the case. The rule is deliberately left out of
  // typescript-eslint's `strictTypeChecked` preset that this config extends, so
  // it must be turned on explicitly — which is why several downstream repos
  // (`zod-utils`, `currency-fa`, `block-no-verify`) already re-add it by hand
  // on top of the base config.
  '@typescript-eslint/no-non-null-assertion': 'error',
  // Forbid a declaration from shadowing a name in an outer scope. A shadowed
  // identifier (a nested `value`, `index`, `result` or `error` that hides the
  // outer binding of the same name) reads as if it refers to the outer one
  // while it does not — a classic "I updated/returned the wrong variable" bug
  // and a frequent source of confusing diffs during refactors. It is exactly
  // the kind of accidental reuse an AI assistant introduces when it drops a new
  // block into existing code without checking the surrounding names, which puts
  // it squarely in this config's explicit-over-clever, bug-prevention stance.
  //
  // The core `no-shadow` rule is intentionally left `off` (see `sharedRules` in
  // `index.js`): it false-positives on TypeScript-specific patterns such as a
  // type and a value legitimately sharing a name, and enum members. The
  // typescript-eslint version understands those cases, so it is the documented
  // replacement rather than a second rule fighting the first. It needs no type
  // information, so it adds no parser cost. This is why downstream repos
  // (`zod-utils`, `block-no-verify`) already re-add `@typescript-eslint/no-shadow`
  // by hand on top of the base config — promoting it into the shared rule set
  // removes that copy-paste.
  '@typescript-eslint/no-shadow': 'error',
  // Require `readonly` on every private class member that is only ever assigned
  // in its declaration or the constructor. A field that is conceptually fixed
  // after construction but left writable reads as if it might change later, so
  // a stray reassignment elsewhere in the class compiles silently and the
  // reader can no longer trust the value is settled — the immutability gap is
  // invisible until something mutates it by accident. Marking it `readonly`
  // turns that accidental write into a compile error and states the contract at
  // the declaration site, which is the same explicit-over-clever,
  // immutability-leaning stance the core `prefer-const` and `no-param-reassign`
  // rules already set for variables and parameters — this extends it to class
  // state. It is exactly the annotation an AI assistant omits when it generates
  // a class, leaving every field mutable by default. The rule is type-aware
  // (it must see the whole class to prove a member is never reassigned), so it
  // lives in the TypeScript-only rule set rather than `sharedRules`, and it is
  // deliberately left out of typescript-eslint's `strictTypeChecked` preset
  // this config extends, so it must be turned on explicitly — which is why
  // downstream repos (`block-no-verify`, `tools-view`) already re-add it by
  // hand on top of the base config. The rule is auto-fixable (`eslint --fix`),
  // so adoption is cheap.
  '@typescript-eslint/prefer-readonly': 'error',
}
