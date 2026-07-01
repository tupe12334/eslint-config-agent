import { noExplicitAnyConfig } from './no-explicit-any/index.js'

export const typescriptEslintRules = {
  ...noExplicitAnyConfig,
  // `strictTypeChecked` (which this config extends) enables
  // `@typescript-eslint/only-throw-error` — the type-aware replacement for the
  // core `no-throw-literal` rule that catches additional cases (e.g. throwing a
  // variable typed as `string | Error`). The core rule is still active in
  // `sharedRules` and, because `sharedRules` is spread into the TypeScript
  // config *after* the preset, it overrides the preset's own `no-throw-literal:
  // 'off'`. Turning the core rule off here (in `typescriptEslintRules`, which
  // is spread after `sharedRules`) ensures TypeScript files are checked only by
  // the type-aware rule so there is no double-reporting of the same violation.
  // The core rule remains active for `.js`/`.jsx` files via `sharedRules`,
  // where the type-aware version does not run.
  'no-throw-literal': 'off',
  // `strictTypeChecked` (which this config extends) includes `recommended`,
  // which enables `@typescript-eslint/no-useless-constructor` for TypeScript
  // files. The core `no-useless-constructor` rule is active in `sharedRules`
  // for JavaScript files. Turning the core rule off here ensures TypeScript
  // files are covered only by the TypeScript-aware variant, preventing
  // double-reporting on the same constructor.
  'no-useless-constructor': 'off',
  // `stylisticTypeChecked` (which this config extends) enables
  // `@typescript-eslint/prefer-nullish-coalescing`, recommending `??` over `||`
  // for nullable-type checks. However, this config deliberately bans the `??`
  // operator via a `no-restricted-syntax` rule (see `noNullishCoalescingConfig`)
  // in favour of explicit `!== null && !== undefined` checks. With both active,
  // a user writing `x || 'default'` (where `x` is nullable) gets
  // `prefer-nullish-coalescing` telling them to use `??`, and then
  // `no-restricted-syntax` forbidding the `??` they just added — an
  // unresolvable contradiction. Turning this rule off here lets
  // `no-restricted-syntax` be the single, authoritative constraint: reach for
  // explicit null checks, not `??`.
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/consistent-type-assertions': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  // Force the **property style** (`foo: (x: number) => void`) for every method
  // member of an interface or object type, and forbid the **method shorthand**
  // (`foo(x: number): void`). The two forms look interchangeable but are not:
  // TypeScript deliberately exempts method-shorthand signatures from
  // `strictFunctionTypes` and checks them *bivariantly* (a documented language
  // unsoundness), while property-style signatures are checked *contravariantly*
  // (sound). In practice a method-shorthand declaration silently accepts an
  // incompatible callback or override that the property style would reject —
  // the incompatibility passes type-checking and only surfaces as a wrong call
  // at runtime. That is exactly the "looks typed, fails at runtime" gap this
  // config exists to close, and it is the signature-side companion of the
  // already-enabled `no-non-null-assertion` and `require-array-sort-compare`
  // rules. The rule is *not* in typescript-eslint's `strictTypeChecked` preset
  // this config extends, so it must be turned on explicitly. It is
  // **auto-fixable** (`eslint --fix`), so adoption costs nothing. Both
  // `tupe12334/zod-utils` and `tupe12334/tools-view` already re-add it by hand
  // on top of the shared config; promoting it here removes that copy-paste and
  // covers every downstream consumer.
  '@typescript-eslint/method-signature-style': ['error', 'property'],
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
  // The export-side mirror of `consistent-type-imports`: force `export type
  // { ... }` for any re-export that only carries types. The two rules guard the
  // same invariant from opposite ends of a module — a binding that exists only
  // in type space must never be smuggled through a value statement. A type-only
  // name re-exported with a plain `export { ... }` is erased at compile time,
  // so the value-shaped statement leaves a runtime export edge for something
  // that has no runtime existence: bundlers keep the source module (and its
  // side effects) alive in the emitted graph, and the re-export breaks outright
  // under `verbatimModuleSyntax` / `isolatedModules`, which reject a value
  // export of a type. Splitting type and value re-exports keeps the emitted
  // module graph honest and the public value-vs-type surface of a barrel file
  // legible — exactly the distinction an AI assistant blurs when it folds a
  // type and a value into one `export { ... }` line. The rule is auto-fixable
  // (`eslint --fix`), so adoption is cheap; this is why downstream repos
  // (`block-no-verify`, `tools-view`) already re-add it by hand on top of the
  // base config. Left at its default `fixMixedExportsWithInlineTypeSpecifier:
  // false` so the fixer emits a separate `export type { ... }` statement rather
  // than the inline `export { type X }` form, matching the
  // `separate-type-imports` choice on the import side.
  '@typescript-eslint/consistent-type-exports': 'error',
  // Forbid the inline `import { type X }` mixed-qualifier form and force a
  // separate top-level `import type { X }` statement instead. This is the
  // erase-side guarantee that completes the type-import trio already in this
  // config (`consistent-type-imports` + `consistent-type-exports`): those two
  // make every type-only import and re-export *declared* as type-only, and this
  // one makes sure that declaration actually disappears from the emitted JS. An
  // inline `import { type X }` still emits a runtime `import` statement for the
  // module — the `type` qualifier only strips the binding, not the side-effect
  // import — so a module imported solely for its types keeps its source (and any
  // side effects) alive in the bundle, the exact runtime-graph leak the trio is
  // meant to prevent. Rewriting it as a standalone `import type { X }` lets
  // TypeScript drop the whole statement, and it is the form
  // `consistent-type-imports` (configured here with
  // `fixStyle: 'separate-type-imports'`) already produces, so the two rules
  // reinforce one statement style rather than fighting. The rule is auto-fixable
  // (`eslint --fix`), so adoption is free, and it is left out of
  // typescript-eslint's `strictTypeChecked` preset that this config extends, so
  // it must be turned on explicitly — which is why downstream repos (`zod-utils`)
  // already re-add it by hand on top of the base config.
  '@typescript-eslint/no-import-type-side-effects': 'error',
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
  // Forbid referencing a `let`/`const`/`class` binding before its textual
  // declaration. Thanks to the Temporal Dead Zone, an early reference to such
  // a binding does not read `undefined` — it throws a `ReferenceError` at
  // runtime, so the file can type-check and look correct while a particular
  // code path (a closure invoked before its outer scope finishes
  // initializing, a module-level `const` referenced by another before both
  // have run) blows up only when actually executed. That looks-right-fails-
  // at-runtime gap is exactly what this config exists to close. Declaration
  // order should be a reliable signal of evaluation order; this rule makes
  // violations a lint error instead of a surprise crash.
  //
  // The core `no-use-before-define` rule is intentionally left `off` (see
  // `sharedRules` in `index.js`): it does not understand TypeScript's hoisted
  // type-level declarations (`interface`, `type`, and `enum` members are safe
  // to reference before their textual position) and would false-positive on
  // them. The typescript-eslint version understands those cases, so it is the
  // documented replacement rather than a second rule fighting the first. It
  // needs no type information, so it adds no parser cost.
  //
  // `functions: false` exempts function declarations, which are fully
  // hoisted (including their body) and safe to call before their textual
  // definition — flagging them would only add noise, not catch a real bug.
  // `classes` and `variables` stay `true` because those bindings are hoisted
  // but left uninitialized (the TDZ), so referencing them early is the actual
  // runtime hazard this rule exists to catch. This mirrors how downstream repo
  // `ameliso-io/web` already configures the rule by hand on top of the base
  // config — promoting it into the shared rule set removes that copy-paste.
  '@typescript-eslint/no-use-before-define': [
    'error',
    { functions: false, classes: true, variables: true },
  ],
  // Forbid declaring a function inside a loop when that function closes over a
  // binding that changes between iterations. A function created in a loop
  // captures its outer variables *by reference*, not by value, so every closure
  // shares the one binding and, by the time any of them runs, sees that
  // binding's final value — not the per-iteration value the author plainly
  // intended. The textbook bug is registering handlers/timers in a loop
  // (`for (let i = 0; ...) el.onclick = () => use(i)` over a `var i`, or pushing
  // `() => row` closures while a loop reassigns `row`): every callback fires with
  // the last value. The function "looks like it captures this iteration" but does
  // not — the same looks-right-fails-at-runtime mismatch this config exists to
  // catch, and exactly the shortcut an AI assistant emits when it lifts a closure
  // into a loop body without checking what the closure captures. The fix is
  // explicit: bind the per-iteration value (a block-scoped `const` inside the
  // loop, a parameter, or `.map`/`.forEach` whose callback gets a fresh binding),
  // which the rule's safe forms allow. It is not in `eslint:recommended` or in
  // typescript-eslint's `strictTypeChecked`/`stylisticTypeChecked` presets this
  // config extends, so it must be enabled explicitly. The typescript-eslint
  // extension is used in place of the core `no-loop-func` because it understands
  // TypeScript scoping — a reference to a type, an `enum`, or a `const` that
  // cannot change across iterations is not flagged — so it keeps the rule's
  // signal without the false positives the core rule raises in typed code. It
  // needs no type information, so it adds no parser cost.
  '@typescript-eslint/no-loop-func': 'error',
  // Prefer optional chaining (`a?.b?.c`) over a chain of `&&` null-guards
  // (`a && a.b && a.b.c`). The `&&`-chain form evaluates the base expression
  // repeatedly and handles `0`, `""`, and `false` as "missing" — a falsy-value
  // coercion bug the type checker cannot catch because the operator is
  // perfectly typed. Optional chaining short-circuits on `null`/`undefined`
  // only, evaluates the base once, and is the form TypeScript was designed to
  // express. It is also shorter and reads left-to-right with no repeated
  // sub-expressions. The rule is auto-fixable (`eslint --fix`), so adoption is
  // cheap. It lives in typescript-eslint's `stylistic-type-checked` preset but
  // NOT in `strict-type-checked`, which is why this config (extending
  // `strictTypeChecked`) must enable it explicitly — and why a downstream repo
  // (`tools-view`) already re-adds it by hand on top of the base config.
  '@typescript-eslint/prefer-optional-chain': 'error',
  // Require any function that returns a `Promise` to be declared `async`. A
  // plain (non-`async`) function that returns a promise can still throw
  // *synchronously* — anything that runs before the promise is constructed (an
  // argument access, a guard clause, a `JSON.parse`) throws on the call stack,
  // not into the returned promise. A caller that does `fn().catch(...)` or
  // `await fn()` only guards the *rejection* path, so that synchronous throw
  // escapes the intended handler and crashes far from its source — the exact
  // mismatch between "looks async, fails sync" that the type checker cannot see
  // (the signature is `Promise<T>` either way). Marking the function `async`
  // moves every error path into the promise, so one `.catch`/`try-await`
  // contract covers the whole function. This is the type-aware completion of
  // already-enabled `@typescript-eslint/no-floating-promises` (handle the
  // promise you get): this rule makes the returned promise the *only* way the
  // function can fail, that one makes sure the caller actually handles it —
  // together they close the async-hygiene loop. It is exactly the shortcut an
  // AI assistant takes when it returns a
  // `.then()` chain from a non-`async` helper. The rule is type-aware and runs
  // under the `projectService` parser options already configured for `.ts`/
  // `.tsx`, which is why downstream repos (`tools-view`) re-add it by hand on
  // top of the base config.
  '@typescript-eslint/promise-function-async': 'error',
  // Require `return await promise` (never a bare `return promise`) inside a
  // `try`/`catch`, and forbid the redundant `return await` everywhere else.
  // A bare `return promise` from inside a `try` block hands the promise back to
  // the caller *before* it settles, so the enclosing `try`/`catch` (and any
  // `finally`) has already unwound by the time the promise rejects: the
  // rejection sails straight past the local `catch` that was written precisely
  // to handle it, and a `finally` meant to run after the work completes runs
  // too early. The function "looks guarded" but isn't — the same looks-safe,
  // fails-elsewhere mismatch this config already targets — and it is exactly
  // what an AI assistant emits when it wraps an async call in `try`/`catch` but
  // drops the `await` on the `return`. Inserting the `await` keeps the promise's
  // lifetime inside the protected scope, so the `catch` fires and the `finally`
  // ordering is correct; as a bonus the awaited frame stays on the async stack
  // trace instead of being elided, so the error points at the real call site.
  // This is the third side of the async-hygiene triangle this config already
  // builds: `no-floating-promises` (handle the promise you get),
  // `promise-function-async` (route every failure through the returned promise),
  // and now `return-await` (keep that promise inside the handler that guards
  // it). `'in-try-catch'` is the surgical mode — it only requires the `await`
  // where omitting it actually changes `try`/`catch`/`finally` behavior and
  // flags the redundant `return await` everywhere else, so it adds correctness
  // without noise. The rule is auto-fixable (`eslint --fix`) and type-aware,
  // running under the `projectService` parser options already configured for
  // `.ts`/`.tsx`.
  '@typescript-eslint/return-await': ['error', 'in-try-catch'],
  // Flag Promises used in positions where their resolution value cannot be
  // observed — the fourth side of the async-hygiene quadrant already in this
  // config (`no-floating-promises`, `promise-function-async`, `return-await`).
  //
  // Three patterns are caught:
  //
  // 1. `checksVoidReturn` (default `true`): an async function passed where the
  //    callback's return type is `void` — the textbook case is
  //    `array.forEach(async item => { await work(item) })`. The returned
  //    `Promise<void>` is structurally assignable to `void`, so TypeScript's
  //    own type-checker never flags it, but the Promise is silently dropped and
  //    its rejection becomes an unhandled rejection crash. The fix is an
  //    explicit `for...of` loop with `await`, or an `async` wrapper that is
  //    then awaited by the caller.
  //
  // 2. `checksConditionals` (default `true`): a Promise used directly in a
  //    boolean context — `if (fetchData())` or `while (poll())`. The Promise
  //    object itself is always truthy, so the condition never reflects the
  //    resolved value; this is almost always a missing `await`.
  //
  // 3. `checksSpreads` (default `true`): `{...asyncFn()}` spreads the Promise
  //    object's own properties (none meaningful) instead of the resolved
  //    object's properties — a silent data-loss bug.
  //
  // All three are silent: TypeScript does not flag them, the code runs without
  // a syntax error, and the bug surfaces at runtime as either a missing
  // side-effect, an always-true conditional, or an empty object spread. They
  // are exactly the "looks correct, fails at runtime" shortcuts an AI assistant
  // produces when it wraps async work in a sync-looking callback or forgets an
  // `await`. The rule is type-aware, so it runs under the `projectService`
  // parser options already configured for `.ts`/`.tsx` files. Downstream repos
  // (`book-processor`) already promote this rule to `error` on top of the base
  // config — promoting it into the shared rule set removes that copy-paste.
  '@typescript-eslint/no-misused-promises': 'error',
  // Require an explicit initializer for every enum member. Without one,
  // TypeScript assigns implicit numeric values (0, 1, 2, …) based on the
  // member's position in the declaration. Reordering members or inserting a
  // new one in the middle silently changes every subsequent member's numeric
  // value — a breaking API change for any caller that stored or compared the
  // raw numbers. The type-checker cannot flag this: the values are still typed
  // as the enum, not as literal `0`/`1`/`2`, so the mismatch only surfaces at
  // runtime. Writing an explicit initializer (`= 'Up'`, `= 1`) makes the
  // assigned value visible and independent of position: adding or reordering
  // members is now safe by construction, and the intent is legible without
  // counting indices. It is exactly the "looks stable, breaks on extension"
  // footgun AI assistants introduce when they generate an enum and leave the
  // compiler to decide the values — the enum counterpart of the
  // `array-callback-return` and `switch-exhaustiveness-check` rules this
  // config already ships for other "silent missing value" bugs. The rule is
  // not in `strictTypeChecked` or `stylisticTypeChecked`, so it must be
  // enabled explicitly. It is not auto-fixable: only the author knows what
  // each member's value should be.
  '@typescript-eslint/prefer-enum-initializers': 'error',
  // Forbid enum declarations that mix numeric and string member values. TypeScript
  // allows both `Status.Active = 0` (number) and `Status.Name = 'active'`
  // (string) in the same declaration, but the resulting type widens in
  // surprising ways: a mixed enum has no reverse-mapping for string members,
  // exhaustiveness checks over it behave differently depending on TypeScript
  // version, and `Object.values(Status)` returns `[0, 'active']` — a
  // heterogeneous array the caller rarely expects. Combined with the existing
  // `prefer-enum-initializers` rule (which makes every member's value
  // explicit), this rule makes the *kind* of value explicit too: all numbers or
  // all strings, never both. It is exactly the implicit ambiguity an AI
  // assistant introduces when it scaffolds an enum from a mixed-type spec ("id
  // is 0, label is 'active'") without deciding which kind to use. The rule is
  // not in `strictTypeChecked` or `stylisticTypeChecked`, so it must be enabled
  // explicitly. It is not auto-fixable: only the author knows whether to
  // normalize to numbers or strings.
  '@typescript-eslint/no-mixed-enums': 'error',
  // Flag a `private` (or `#hashPrivate`) class field or method that is never
  // read/called anywhere in the class body. An unused private member is dead
  // code — either a leftover from a refactor that forgot to delete it, or
  // (worse) a sign the author meant to wire it up but a typo or a missed call
  // site left it orphaned, silently changing nothing at runtime while the
  // reader assumes it does. Because the member is `private`, nothing outside
  // the class can be using it either, so there is no legitimate external
  // caller to account for. This is exactly the kind of unreferenced code an
  // AI assistant leaves behind when it scaffolds a field or helper method
  // "for later" and then never finishes wiring it in.
  //
  // The core `no-unused-private-class-members` rule is intentionally left
  // `off` (see `sharedRules` in `index.js`): it only understands `#hashPrivate`
  // fields, not TypeScript's `private` keyword, so a TS project's actual
  // dead-code surface (mostly `private` members, not `#hashPrivate` ones)
  // would go unchecked. This typescript-eslint variant is a strict superset —
  // it flags both forms — and needs no type information, so it adds no
  // parser cost.
  '@typescript-eslint/no-unused-private-class-members': 'error',
}
