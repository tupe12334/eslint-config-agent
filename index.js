import js from '@eslint/js'
import unicorn from 'eslint-plugin-unicorn'
import earlyReturn from 'eslint-plugin-early-return'
import switchCase from 'eslint-plugin-switch-case'
import jsxClassname from 'eslint-plugin-jsx-classname'
import jsdoc from 'eslint-plugin-jsdoc'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import { basePluginsConfig } from './configs/base-plugins.js'
import { configFilesConfig } from './configs/config-files.js'
import { examplesConfig } from './configs/examples.js'
import { javascriptConfig } from './configs/javascript.js'
import { jsxConfig } from './configs/jsx.js'
import { overridesConfig } from './configs/overrides.js'
import { storybookConfig } from './configs/storybook.js'
import { testFilesConfig } from './configs/test-files.js'
import { tsxConfig } from './configs/tsx.js'
import { typescriptConfig } from './configs/typescript.js'
import { plugins } from './plugins/index.js'
import allRules from './rules/index.js'
import { noInlineUnionTypesConfigs } from './rules/no-inline-union-types/index.js'
import { noRecordLiteralTypesConfigs } from './rules/no-record-literal-types/index.js'

// Shared rules for both JS and TS files
const sharedRules = {
  ...allRules.pluginRules,
  'object-curly-newline': 'off',
  'no-shadow': 'off',
  'comma-dangle': 'off',
  'function-paren-newline': 'off',
  quotes: 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  // The core/`@typescript-eslint` `no-unused-vars` rules are disabled above, so
  // nothing flagged dead imports. `eslint-plugin-unused-imports` fills that gap
  // and, unlike the base rules, auto-fixes them: an unused `import` is pure dead
  // weight (no runtime effect, just noise and slower builds) and is always safe
  // to delete. Scoped to imports only — unused locals/args are left alone here.
  'unused-imports/no-unused-imports': 'error',
  'max-lines-per-function': allRules.maxFunctionLinesWarning,
  'max-lines': allRules.maxFileLinesWarning,
  semi: 'off',
  complexity: 'off',
  'no-trailing-spaces': allRules.noTrailingSpacesConfig,
  'operator-linebreak': 'off',
  'implicit-arrow-linebreak': 'off',
  'arrow-body-style': 'off',
  'no-continue': 'off',
  // Additional built-in error handling rules
  'prefer-promise-reject-errors': 'error',
  // Disallow returning a value from a `Promise` executor — the function passed
  // to `new Promise((resolve, reject) => { ... })`. The executor's return value
  // is discarded by the Promise constructor, so `new Promise(() => readfile())`
  // or `new Promise((resolve) => resolve(x))` written with an implicit return
  // body silently throws the value away. When the returned value is itself a
  // promise (an async executor, a `.then(...)` chain) this is a real bug: the
  // work runs unobserved, rejections become unhandled, and the outer promise
  // settles on a different schedule than the author expects. This is a
  // correctness check, not a style preference — the same class of "the callback
  // returns into a void" mistake that `array-callback-return` above guards
  // against, and exactly the kind of quiet, wrong-behavior bug that type
  // checking will not catch and that AI assistants emit when they reach for a
  // brace body inside `new Promise`. It is not in `eslint:recommended`, so it is
  // enabled explicitly here. The rule is not auto-fixable because only the
  // author knows whether the value should be dropped or the surrounding control
  // flow reworked.
  'no-promise-executor-return': 'error',
  // Disallow `await` inside a loop body. An `await` in a `for`/`for-of`/`while`
  // loop pauses the loop on every iteration and only starts the next one after
  // the current promise settles, so N independent async operations that could
  // have run concurrently are instead serialized end-to-end: the loop takes the
  // *sum* of the latencies instead of the *max*. On a list of network/DB calls
  // that turns a sub-second batch into an N-times-slower stall — a quiet
  // performance bug the type checker cannot see (the code is perfectly typed and
  // correct, just slow) and exactly the shape an AI assistant emits when it
  // mechanically drops an `await` into a `for` loop instead of reaching for
  // `Promise.all`/`Promise.allSettled` over a `.map`. This is the throughput
  // side of the async-hygiene family this config already builds with
  // `no-floating-promises`, `promise-function-async` and `return-await`. When
  // the iterations are genuinely dependent (each one needs the previous result,
  // an ordered write, a deliberate rate limit), the serial `await` is correct —
  // the rule has no auto-fix precisely because only the author knows that, so
  // those loops opt out with an inline `// eslint-disable-next-line
  // no-await-in-loop`. It is not in `eslint:recommended`, so it is enabled
  // explicitly here.
  'no-await-in-loop': 'error',
  // Disallow loop conditions that reference a variable that is never modified
  // inside the loop body. A loop whose condition tests a value that nothing
  // inside the body ever updates is almost always a bug: either an unintended
  // infinite loop or a forgotten increment / mutation. TypeScript does not
  // catch this because the code is well-typed — the variable simply keeps its
  // initial value and the condition never changes truth-value. This is exactly
  // the kind of quiet, wrong-behavior bug AI assistants emit when they
  // scaffold a loop body and lose track of what actually advances it. It is
  // not in `eslint:recommended`, so it must be enabled explicitly here. The
  // rule has a very low false-positive rate (genuine cases where an outer scope
  // change is intended are rare and easy to suppress with a comment) and is not
  // auto-fixable because only the author knows which variable was meant to
  // change.
  'no-unmodified-loop-condition': 'error',
  // Disallow an `else`/`else if` block when the preceding `if` already exits
  // the function via `return`. The `else` is dead weight: once the `if` branch
  // returns, the code after it is unreachable from that path, so wrapping the
  // remainder in `else` only adds a level of nesting that hides the real
  // control flow. This is the built-in companion to the `early-return` plugin
  // already enabled here — both push code toward flat, guard-clause style
  // instead of the deeply-nested if/else trees AI assistants tend to emit. The
  // rule is auto-fixable, so consumers can adopt it with `eslint --fix`.
  'no-else-return': ['error', { allowElseIf: false }],
  // Disallow an `if` statement as the *only* statement inside an `else` block,
  // requiring `else if` instead. The lone `if`-in-`else` adds an indentation
  // level that hides what is really a flat chain of conditions, the same
  // needless nesting the `no-else-return` rule directly above and the bundled
  // `early-return` plugin already push back on, and a shape AI assistants emit
  // when they mechanically wrap each new branch instead of extending the chain.
  // Collapsing it into an `else if` keeps the control flow flat and legible. The
  // rule is auto-fixable, so consumers can adopt it with `eslint --fix`.
  // Note: `unicorn/no-lonely-if` covers a different pattern (lone `if` inside
  // another `if` without `else`), so both rules are active — they are complementary.
  'no-lonely-if': 'error',
  // Disallow a `return;` (or `return undefined;`) that is the last statement of
  // a function and so changes nothing — control already falls off the end and
  // yields `undefined`. A redundant trailing `return` reads as if it guards
  // something or hands back a meaningful value when it does neither; it is dead
  // punctuation that hides the real control flow, exactly what this config's
  // explicit-over-clever stance exists to surface. It is the natural companion
  // to the `no-else-return` rule just above and to the `early-return` plugin
  // already enabled here: that pair flattens branching by removing unneeded
  // `else` blocks, and this removes the now-pointless `return` they often leave
  // behind. The rule is auto-fixable, so consumers can adopt it with
  // `eslint --fix`.
  'no-useless-return': 'error',
  // Disallow a value assigned to a variable that is never read before the
  // variable is overwritten or its scope ends — a "dead store". Writing
  // `let total = compute()` and then unconditionally reassigning `total = 0`
  // (or returning before `total` is ever used) throws the first value away,
  // and that wasted write is almost never deliberate: it usually means the
  // author meant to *use* the value, assigned to the wrong variable, or left a
  // half-finished branch behind. The result is code that reads as if a value
  // flows through when it silently does not — exactly the quiet, wrong-behavior
  // bug type checking will not catch (the types line up; only the data flow is
  // broken) and one AI assistants emit when they stitch branches together or
  // forget to thread a computed value into its use. It is the data-flow sibling
  // of the `no-useless-return` rule just above: both surface statements that
  // look load-bearing but change nothing. The rule relies on ESLint's code-path
  // analysis (added in ESLint 9.14) and is not in `eslint:recommended`, so it
  // is enabled explicitly here. It is not auto-fixable because only the author
  // knows whether the dead store should be deleted or its value actually used.
  'no-useless-assignment': 'error',
  // Disallow assignment inside a `return` statement — `return total = compute()`
  // or `return (found = next)`. An `=` in the spot a reader expects a value (and
  // where `==`/`===` belongs) does two things at once: it mutates a binding and
  // hands back the assigned value, so the side effect hides in the returned
  // expression where almost no one looks for it. It is most often a typo for a
  // comparison (`return found === next`) or a leftover from refactoring a guard,
  // and the code still type-checks because the assigned value has the right type
  // — only the data flow is wrong, exactly the quiet, plausible-but-wrong shape
  // this config exists to surface and one AI assistants emit when they fold an
  // update into a `return`. It sits with the assignment-discipline rules already
  // here — `no-param-reassign`, `no-multi-assign` and the `no-useless-assignment`
  // dead-store check directly above — all of which keep where and how values are
  // written explicit. `'always'` flags the assignment even when wrapped in
  // parentheses, so the deliberate-looking `return (x = y)` form is rejected too;
  // an author who truly means it can split the assignment onto its own line. It
  // is not in `eslint:recommended`, so it is enabled explicitly here, and it is
  // not auto-fixable because only the author knows whether a comparison or a
  // separate statement was intended.
  'no-return-assign': ['error', 'always'],
  // Disallow ternaries whose branches are themselves a boolean literal
  // (`cond ? true : false`, `cond ? false : true`) or that re-test a value
  // they could simply fall through to (`a ? a : b`). These are the flat
  // sibling of the nested ternaries `no-nested-ternary` already bans here:
  // punctuation-heavy expressions that dress up a plain boolean (or the
  // condition itself) as a branch, exactly the "clever but unreadable"
  // shortcut this config exists to prevent and one AI assistants reach for
  // often. The explicit form — the condition itself, a negation, or a real
  // `if` — keeps the intent legible. The rule is auto-fixable, so consumers
  // can adopt it with `eslint --fix`. `defaultAssignment: false` extends the
  // check to the `a ? a : b` default-value idiom as well.
  'no-unneeded-ternary': ['error', { defaultAssignment: false }],
  // Require the `default` clause of a `switch` to come last. A `default` matches
  // only when no `case` does, so its precedence is independent of where it sits
  // — but a `default` written *before* later cases reads as if those cases were
  // unreachable, and a mid-`switch` `default` that omits `break` silently falls
  // through into the cases below it. Both are the "looks one way, behaves
  // another" footgun this config exists to surface, and a shape an AI assistant
  // emitting a `switch` can easily introduce. Pinning `default` to the end keeps
  // its order-independent meaning legible. It sits with the bundled `switch-case`
  // rules already enabled here. It is not in `eslint:recommended`, so it is
  // enabled explicitly, and it is not auto-fixable because moving a clause that
  // omits `break` could change behavior — only the author can reorder safely.
  'default-case-last': 'error',
  // Require strict equality (=== / !==). Loose equality performs implicit type
  // coercion, exactly the kind of "clever" shortcut this config exists to
  // prevent. Enforcing it in the shared config means consumers no longer have
  // to re-add it on top of the package.
  eqeqeq: ['error', 'always'],
  // Require the natural reading order in comparisons: the variable (or
  // expression) on the left, the literal on the right — `count === 0`, never
  // `0 === count`. The reversed "Yoda" form exists only to guard against the
  // assignment typo `if (count = 0)`, but `eqeqeq` (directly above) already
  // forces `===`/`!==` everywhere, and TypeScript flags accidental assignment
  // in a condition as a type error, so the Yoda workaround is pure readability
  // tax. `exceptRange` keeps the clearer range idiom (`0 <= x && x < limit`)
  // which reads as a natural number-line comparison and is harder to express in
  // the canonical order. The rule is auto-fixable, so consumers can adopt it
  // with `eslint --fix`.
  yoda: ['error', 'never', { exceptRange: true }],
  // Disallow reassigning function parameters and mutating their properties.
  // Reassigning a parameter decouples it from the caller's argument and hides the
  // function's real inputs; mutating a parameter's properties causes
  // action-at-a-distance bugs where a callee silently rewrites an object the
  // caller still holds. Both undermine this config's explicit-over-clever,
  // immutability-leaning stance, so treat parameters as read-only here.
  'no-param-reassign': ['error', { props: true }],
  // Require every parameter with a default value to come after all parameters
  // without one. A default can only ever take effect when the argument is
  // `undefined`, so a default placed before a required parameter
  // (`f(a = 1, b)`) is unreachable in practice: the caller cannot skip `a` to
  // reach `b`, they must pass `f(undefined, x)` to use the default — at which
  // point the default documents an API the call sites cannot actually use.
  // It is almost always a mistake for the parameter order, not a deliberate
  // signature, and exactly the kind of plausible-but-wrong shape an AI
  // assistant emits when it bolts a default onto the first convenient
  // parameter. This sits with the parameter-discipline rules already here
  // (`no-param-reassign` directly above): keep a function's inputs honest and
  // its signature meaningful. It is not in `eslint:recommended`, so it is
  // enabled explicitly. The rule is not auto-fixable because reordering
  // parameters would silently break every call site, so only the author can
  // decide whether the default or the order was wrong.
  'default-param-last': 'error',
  // Require `const` for bindings that are never reassigned. This is the
  // local-binding counterpart to `no-param-reassign`: together they extend the
  // config's immutability-leaning stance from parameters to every variable. A
  // `let` that is never reassigned misleads readers into expecting a mutation
  // that never comes; `const` documents fixed intent up front. The rule is
  // auto-fixable (`eslint --fix`), so adoption is cheap. `destructuring: 'all'`
  // only flags a destructuring pattern when every introduced binding could be
  // `const`, leaving mixed const/let destructuring alone.
  'prefer-const': ['error', { destructuring: 'all' }],
  // Disallow shorthand type coercions such as `!!value`, `+str`, `1 * x`,
  // `'' + n` and `~str.indexOf(...)`. These are the sibling of the loose
  // equality `eqeqeq` already bans here: terse tricks that hide an implicit
  // type conversion behind punctuation, exactly the "clever but unreadable"
  // shortcut this config exists to prevent and one AI assistants reach for
  // often. Requiring the explicit form (`Boolean(value)`, `Number(str)`,
  // `String(n)`) keeps the intended conversion legible. The rule is
  // auto-fixable, so consumers can adopt it with `eslint --fix`.
  'no-implicit-coercion': ['error', { allow: [] }],
  // Require an explicit radix argument to `parseInt` — `parseInt(str, 10)`,
  // never `parseInt(str)`. With the base omitted, `parseInt` infers it from the
  // string: a leading `0x` is read as hex and, depending on the engine, a
  // leading `0` can be read as octal, so `parseInt('0x10')` is `16` and
  // `parseInt(userInput)` silently parses in a base the author never chose. The
  // wrong-number result type-checks fine (it is still a `number`) and only the
  // data flow is broken — exactly the quiet, plausible-but-wrong shape this
  // config exists to surface, and the same class of *implicit* behavior it
  // already bans via `eqeqeq` and `no-implicit-coercion` directly above.
  // Forcing the base makes the parse deterministic and the intent explicit. The
  // rule is not auto-fixable because only the author knows which base was meant.
  radix: ['error', 'always'],
  // Require template literals instead of string concatenation. Building a
  // string by chaining `+` (`'Hello ' + name + '!'`) scatters the literal
  // text across operators, makes the final shape hard to read, and leans on
  // the same implicit coercion `no-implicit-coercion` already bans whenever a
  // non-string operand sneaks in. A template literal (`` `Hello ${name}!` ``)
  // keeps the literal text and the interpolated values visually aligned, which
  // is exactly the explicit, readable form this config favors and one AI
  // assistants frequently skip. The rule is auto-fixable, so consumers can
  // adopt it with `eslint --fix`.
  'prefer-template': 'error',
  // Disallow concatenating two string literals — `'Hello ' + 'World'`,
  // `'a' + 'b' + 'c'`, or a literal split across lines with `+`. The operands
  // are known at author time, so the `+` does nothing the source could not say
  // directly: it is pure punctuation that hides a single constant string behind
  // an operator and invites the reader to wonder whether a variable was meant.
  // It is the static sibling of the `prefer-template` rule just above — that one
  // pushes runtime interpolation onto template literals, this one removes the
  // join entirely when there is no value to interpolate — and it leans on the
  // same implicit-`+` surface the config already narrows with `prefer-template`,
  // `no-implicit-coercion` and `@typescript-eslint/restrict-plus-operands`.
  // Collapsing the pieces into one literal (or a template literal when the line
  // length is the only reason for the split) is the explicit, readable form this
  // config favors and one AI assistants frequently skip. The rule is not
  // auto-fixable because only the author knows whether the two pieces were meant
  // to be one literal or a refactor left a variable behind.
  'no-useless-concat': 'error',
  // Disallow `.bind()` on a function that never references `this` (and has no
  // bound arguments) — `function () { return 1 }.bind(this)`,
  // `(() => x).bind(obj)`, `handler.bind(this)` where `handler` ignores `this`.
  // The `.bind()` does nothing: it allocates a new wrapper function on every
  // evaluation and returns one that behaves identically to the original, so the
  // call is pure overhead that also misleads the reader into thinking the
  // receiver matters when it does not. It is the same "looks meaningful but is
  // dead" clutter the `no-useless-return`, `no-useless-assignment` and
  // `no-useless-concat` rules already remove here, and exactly the reflexive
  // `.bind(this)` an AI assistant appends to a callback by habit, whether or not
  // the body uses `this`. Dropping the bind leaves the explicit, allocation-free
  // form this config favors. The rule is auto-fixable, so consumers can adopt it
  // with `eslint --fix`; it is not in `eslint:recommended`, so it is enabled
  // explicitly here.
  'no-extra-bind': 'error',
  // Disallow `.call()` and `.apply()` when the first argument (the `this`
  // binding) is `undefined` or `null` and the result is identical to a
  // direct call. `fn.call(null, a, b)` behaves exactly like `fn(a, b)` in
  // non-strict mode and almost always in strict mode: the wrapper only adds
  // noise and an extra property lookup. `fn.apply(undefined, [a, b])` is the
  // same deadweight applied to a spread. The two are the direct-invocation
  // counterpart of the `no-extra-bind` rule just above, which catches
  // `.bind()` that never changes `this` — together they close the "look up
  // the prototype chain to call the function" footgun an AI assistant emits
  // when it wants to forward arguments or detach a method without realizing
  // a direct call suffices. The rule is auto-fixable (`eslint --fix`) and is
  // not in `eslint:recommended`, so it is enabled explicitly here.
  'no-useless-call': 'error',
  // Require `Object.hasOwn(obj, key)` over the legacy ways of asking the same
  // question. The two forms it replaces are each a footgun: calling
  // `obj.hasOwnProperty(key)` directly breaks the moment `obj` has a `null`
  // prototype (`Object.create(null)`, many map-like objects) or shadows the
  // method with an own `hasOwnProperty` field — it throws or returns the wrong
  // answer — which is why `no-prototype-builtins` already bans it; and the safe
  // workaround, `Object.prototype.hasOwnProperty.call(obj, key)`, is a long,
  // punctuation-heavy incantation that hides a one-word intent behind prototype
  // plumbing. `Object.hasOwn` is the single explicit, prototype-safe spelling of
  // "does this object own this key", so it fits this config's
  // explicit-over-clever, correctness-leaning stance and removes the boilerplate
  // adopters would otherwise reach for. It is auto-fixable (`eslint --fix`) and
  // available on every supported runtime (Node >= 20, ES2022), so adoption is
  // free.
  'prefer-object-has-own': 'error',
  // Disallow `var`. `var` declarations are function-scoped and hoisted, so
  // they leak out of the block they appear to belong to and read as
  // initialized `undefined` before their declaration runs — producing
  // order-dependent bugs that block-scoped `let`/`const` make impossible.
  // `var` is exactly the legacy shortcut an AI assistant trained on older
  // code reaches for, which puts it squarely in scope for this config's
  // explicit-over-clever, AI-safety stance. It is also the foundation the
  // `prefer-const` rule builds on. The rule is auto-fixable.
  'no-var': 'error',
  // Require object literal shorthand for properties and methods, so
  // `{ value: value }` collapses to `{ value }` and `{ run: function () {} }`
  // to `{ run() {} }`. The longhand forms carry no extra meaning — they are
  // pure boilerplate that an AI assistant trained on older code routinely
  // emits, and the duplicated `value: value` name is a common spot for a
  // copy-paste typo that the shorthand removes entirely. Enforcing one
  // canonical object form keeps literals legible and consistent, matching
  // this config's explicit-over-clever, low-noise stance. The rule is
  // auto-fixable, so consumers can adopt it with `eslint --fix`.
  'object-shorthand': ['error', 'always'],
  // Require the compound assignment shorthand (`x += 1`, `total *= rate`)
  // wherever a variable is assigned the result of an operation on itself, so
  // `x = x + 1` is rewritten to `x += 1`. The longhand form names the target
  // twice — once on each side of the `=` — and that duplicated operand is a
  // silent typo site: `total = totals + 1` reads as a self-update but quietly
  // assigns from a *different* variable, a bug type checking cannot catch when
  // both names are in scope. Collapsing to `+=` removes the
  // second spelling of the name entirely, so the mismatch becomes impossible to
  // write. This is the assignment sibling of the `object-shorthand` rule just
  // above (which removes the same duplicated-name typo site in `{ value: value }`)
  // and fits this config's explicit-over-clever, low-noise, correctness-leaning
  // stance: one canonical spelling of "update this in place". The longhand is
  // also exactly what an AI assistant trained on older code reaches for. The
  // rule is auto-fixable, so consumers can adopt it with `eslint --fix`.
  'operator-assignment': ['error', 'always'],
  // Require the logical-assignment shorthand (`x ||= y`, `x &&= y`, `x ??= y`)
  // wherever a binding is reassigned by a logical expression over itself. A
  // longhand `x = x || defaultValue` names the target twice — once as the left
  // operand of `||` and once as the assignment destination — which is the same
  // duplicated-name typo site the `operator-assignment` rule directly above
  // already catches for arithmetic operators. Writing `x ||= defaultValue`
  // removes the second spelling of the name entirely so the assignment-by-typo
  // footgun disappears, and it states the intent — "set this variable only if it
  // is currently falsy / nullish / truthy" — in fewer characters and with the
  // exact same semantics. The three forms map directly onto the boolean and
  // nullish operators the config already steers code toward (`eqeqeq`,
  // `@typescript-eslint/prefer-nullish-coalescing`): `&&=` for "assign only when
  // truthy", `||=` for "assign only when falsy", `??=` for "assign only when null
  // or undefined". `enforceForIfStatements: true` extends the check to the
  // equivalent `if`-guarded form (`if (!x) x = y`, `if (x == null) x = y`), so
  // both the expression and the statement spelling of the pattern are caught. The
  // longhand `x = x || y` is also exactly what an AI assistant trained on
  // pre-ES2021 code reaches for, which puts it squarely in this config's
  // AI-safety scope alongside `operator-assignment`. The rule is auto-fixable
  // (`eslint --fix`), so adoption is free, and it is not in `eslint:recommended`,
  // so it must be enabled explicitly here.
  'logical-assignment-operators': [
    'error',
    'always',
    { enforceForIfStatements: true },
  ],
  // Disallow chained assignment expressions such as `a = b = c = 0`. Chaining
  // collapses several writes into one expression: the value flows right-to-left
  // through bindings that have nothing to do with each other, so a reader has to
  // unwind the chain to see how many variables changed and to what. It also
  // quietly couples those variables — touching the chain later risks rewriting
  // more than intended — which runs against the immutability-leaning stance the
  // `prefer-const`, `no-param-reassign` and `no-var` rules above already set
  // here. It is exactly the terse, "clever" shortcut this config exists to
  // prevent and one AI assistants emit when packing initialization onto a single
  // line. Writing each assignment on its own statement keeps the data flow
  // explicit.
  'no-multi-assign': 'error',
  // Disallow `${...}` placeholders inside ordinary string literals
  // (`'Hello ${name}'`, `"total: ${count}"`). Template-literal interpolation
  // only works inside backticks; the moment the quotes are single or double,
  // `${name}` is just literal text and the value is silently never inserted —
  // a bug that type-checking cannot catch because the result is still a valid
  // `string`. Mixing up the quote character is exactly the kind of silent
  // mistake an AI assistant emits when stitching messages together, which puts
  // it squarely in scope for this config's correctness-and-clarity stance. It
  // is the natural companion to the explicit-conversion rules
  // (`no-implicit-coercion`, `eqeqeq`) above: it keeps string building honest
  // by forcing a real template literal whenever interpolation is intended.
  'no-template-curly-in-string': 'error',
  // Disallow the `Object` constructor (`new Object()` and `Object()`) in favor
  // of the `{}` object literal. The constructor form is a strictly more verbose,
  // more indirect way to do exactly what the literal does — and a trap: passing
  // a single non-object argument makes `Object(x)` return *that* value (or a
  // wrapper), so the call quietly stops creating a fresh object at all. The
  // literal has no such ambiguity. This is the object-creation sibling of the
  // wrapper-constructor and coercion bans this config already sets (`Number`,
  // `String`, `!!x`): prefer the plain literal/value over a constructor call
  // dressed up as one. `new Object()` is also a legacy idiom an AI assistant
  // trained on older code reaches for, which puts it squarely in this config's
  // explicit-over-clever, AI-safety scope. The rule is auto-fixable, so
  // consumers can adopt it with `eslint --fix`.
  'no-object-constructor': 'error',
  // Disallow the primitive-wrapper constructors `new String()`, `new Number()`,
  // and `new Boolean()`. These do the opposite of what they look like: instead of
  // converting to a primitive they produce a **boxed object**, so
  // `typeof new Number(5)` is `'object'` (not `'number'`),
  // `new Boolean(false)` is always truthy (the object is truthy), and
  // `new String('x') === 'x'` is `false`. The caller typically expects a
  // primitive and the wrong type is a quiet, wrong-result trap that the type
  // checker will not always catch when the boxed type is widened to `object`.
  // For conversion use the unadorned call form (`Number(str)`, `String(n)`,
  // `Boolean(x)`) — that is what `no-implicit-coercion` already pushes code
  // toward, and these two rules are complementary: `no-implicit-coercion` bans
  // the shorthand coercions (`!!x`, `+str`), `no-new-wrappers` bans the
  // constructor path to the same wrong object. The rule is auto-fixable, so
  // consumers can adopt it with `eslint --fix`.
  'no-new-wrappers': 'error',
  // Require object spread (`{ ...a, ...b }`) over `Object.assign({}, a, b)` when
  // the call is building a brand-new object (its first argument is an object
  // literal). The `Object.assign({}, ...)` form is a more indirect, punctuation-
  // heavy spelling of the same intent: a reader has to recognize the empty `{}`
  // accumulator and the mutate-and-return semantics just to conclude "this makes
  // a fresh, merged object", which the spread states directly. It is the
  // object-merging sibling of the `no-object-constructor` ban right above —
  // both reject an indirect construction idiom in favor of the plain literal —
  // and of `object-shorthand`, which already pushes object literals toward their
  // most legible form. `Object.assign` onto an existing target (`Object.assign(
  // target, src)`) mutates and is left alone, so only the new-object case is
  // flagged. The rule is auto-fixable, so consumers can adopt it with
  // `eslint --fix`.
  'prefer-object-spread': 'error',
  // Require a `return` from every array-method callback that is expected to
  // produce one (`map`, `filter`, `reduce`, `every`, `some`, `find`, `sort`,
  // `flatMap`, ...). A callback that falls off the end returns `undefined`, so
  // `arr.map(x => { doSomething(x) })` silently yields an array of `undefined`
  // and `arr.filter(x => { x.active })` keeps every element — the kind of
  // quiet, wrong-result bug that type checking will not catch and that AI
  // assistants emit when they reach for a brace body and forget the `return`.
  // Unlike most rules here this is a correctness check, not a style
  // preference, which is why it is not covered by `eslint:recommended` and is
  // enabled explicitly. `checkForEach: true` flags the inverse mistake —
  // returning a value from `forEach`, where the result is discarded — which
  // usually means `map` was intended. The rule is not auto-fixable because
  // only the author knows what each callback should return.
  'array-callback-return': [
    'error',
    { allowImplicit: false, checkForEach: true },
  ],
  // Disallow a loop whose body always exits on the first iteration — a `for`,
  // `while`, or `do...while` where every control-flow path ends in `return`,
  // `break`, or `throw`. Such a loop can never reach a second pass: it reads
  // as "iterate every element" but actually runs at most once, collapsing what
  // the author probably meant as a search into a single-element check. The
  // classic form is a misplaced `return` inside a `for-of`:
  //   `for (const item of list) { if (cond(item)) return item; return null }`
  // The unconditional `return null` exits on the first iteration regardless of
  // the condition, so every element after the first is silently ignored. This
  // is a wrong-result correctness bug that type checking cannot catch (the
  // types are fine; only the data flow is broken) and exactly the shape AI
  // assistants emit when they flatten a "find the first match" pattern into a
  // loop and lose track of which exit belongs where. It is the loop-level
  // sibling of `array-callback-return` directly above: both catch the "loop
  // body was supposed to visit every element, but silently doesn't" class of
  // mistake. The rule is not in `eslint:recommended`, so it is enabled
  // explicitly. It is not auto-fixable because only the author knows whether
  // the loop or the misplaced exit is wrong.
  'no-unreachable-loop': 'error',
  // Only allow throwing real `Error` objects — reject `throw 'boom'`,
  // `throw { code: 500 }`, `throw 42` and any other non-Error value. A thrown
  // string or plain object carries no stack trace, so the failure surfaces with
  // no record of where it came from, and it breaks every `catch (e)` that does
  // `e instanceof Error` or reads `e.message`/`e.stack` — the consumer's error
  // handling silently misfires. Throwing a bare literal is exactly the terse
  // shortcut an AI assistant emits when it wants to bail out fast, which puts it
  // squarely in this config's correctness-over-clever, AI-safety scope, and it
  // pairs with the bundled `error/*` rules that already shape how errors are
  // declared. Unlike most rules here it catches an outright correctness
  // mistake, not a style preference, which is why it is enabled explicitly —
  // `eslint:recommended` does not turn it on. The rule is not auto-fixable
  // because only the author knows which `Error` subclass the literal should
  // become.
  'no-throw-literal': 'error',
  // Disallow comparing a variable to itself (`x === x`, `x !== x`,
  // `i < i`, ...). A self-comparison is either a plain bug — the author meant
  // to compare against a different operand and the result is a constant
  // `true`/`false` that quietly disables a branch — or the deliberate
  // `value !== value` trick for detecting `NaN`. Both belong to the same
  // family the `eqeqeq`, `no-implicit-coercion` and `no-unneeded-ternary`
  // rules above already target: a punctuation-heavy expression whose real
  // intent is hidden, exactly the "clever but unreadable" shortcut this config
  // exists to prevent and one AI assistants emit when stitching together
  // conditions. Unlike most rules here this also catches an outright
  // correctness mistake, which is why it is enabled explicitly —
  // `eslint:recommended` does not turn it on. The explicit form
  // (`Number.isNaN(value)` for the NaN case, the intended operand otherwise)
  // keeps the check legible. The rule is not auto-fixable because only the
  // author knows which operand was meant.
  'no-self-compare': 'error',
  // Disallow optional chaining in positions where a short-circuit to
  // `undefined` is immediately used in a way that throws at runtime — member
  // access, a call, arithmetic, spread, `instanceof`, `in`, or destructuring on
  // the result. `(obj?.foo).bar`, `(obj?.fn)()`, `(obj?.count) + 1` and
  // `[...(obj?.list)]` all look guarded, but the `?.` only protects the link it
  // sits on: the moment the chain yields `undefined`, the surrounding `.bar` /
  // `()` / `+` / spread runs against `undefined` and throws a `TypeError`. The
  // author wrote `?.` precisely because the left side can be nullish, so this is
  // an outright correctness bug — the guard is defeated by the very expression
  // wrapped around it — not a style preference. It is exactly the half-applied
  // null-safety an AI assistant emits when it sprinkles `?.` onto one segment of
  // a longer access, which puts it in this config's correctness-over-clever, AI-
  // safety scope alongside `no-throw-literal` and `no-self-compare` above. The
  // fix is to extend the optional chain over the whole access (`obj?.foo?.bar`)
  // or to guard the result before using it; only the author knows which, so the
  // rule is not auto-fixable. `eslint:recommended` does enable this, but this
  // config does not extend that preset, so it is turned on explicitly here. The
  // shared `web` app of the `animals-shop` repo enforced this rule manually; it
  // belongs in the shared config so every consumer is covered.
  'no-unsafe-optional-chaining': [
    'error',
    { disallowArithmeticOperators: true },
  ],
  // Disallow computed keys that wrap a literal that could be written plainly —
  // `{ ['name']: x }`, `{ [42]: y }`, or `class { ['method']() {} }`. The
  // bracket syntax exists for keys that must be computed at runtime; using it
  // for a static string or number adds punctuation and a layer of indirection
  // that buys nothing and only makes the reader pause to confirm the key is
  // constant after all. It is the same "clever but pointless" clutter the
  // `no-unneeded-ternary` and `no-implicit-coercion` rules already ban here,
  // and one AI assistants emit when they template object keys mechanically.
  // The plain form (`{ name: x }`, `{ method() {} }`) states intent directly.
  // The rule is auto-fixable, so consumers can adopt it with `eslint --fix`.
  // `enforceForClassMembers: true` extends the check from object literals to
  // class members so both surfaces stay consistent.
  'no-useless-computed-key': ['error', { enforceForClassMembers: true }],
  // Disallow building functions from strings with the `Function` constructor —
  // `new Function('a', 'b', 'return a + b')` or `Function(...)()`. This is `eval`
  // wearing a different name: the body is an opaque string the parser, the type
  // checker and every reader have to take on faith, it executes in the global
  // scope (so it silently can't see the surrounding closure a reader would
  // expect it to), and feeding it any untrusted input is a direct code-injection
  // hole. There is a plain, safe equivalent for every legitimate use — an actual
  // function literal — so the dynamic form buys nothing but risk. It sits
  // squarely in this config's scope: a footgun an AI assistant reaches for when
  // asked to "build a function dynamically," and one `eslint-plugin-security`
  // does not cover (its eval rule, `detect-eval-with-expression`, flags `eval`
  // and not the `Function` constructor). The rule is not auto-fixable because
  // only the author can restate the string body as real code.
  'no-new-func': 'error',
  // Disallow `eval(...)`. It hands a string to the JavaScript engine to parse
  // and run at runtime: the body is opaque to the parser, the type checker and
  // every reader, it can reach and mutate the surrounding scope, and feeding it
  // any untrusted input is the textbook code-injection hole. There is a plain,
  // safe equivalent for every legitimate use, so the dynamic form buys nothing
  // but risk. This is the direct-`eval` companion to the `no-new-func` ban right
  // above (which catches `eval` wearing the `Function`-constructor disguise) —
  // together they close the runtime-string-execution footgun an AI assistant
  // reaches for when asked to "run this code dynamically." It is not in
  // `eslint:recommended`, so it is enabled explicitly. Not auto-fixable: only
  // the author can restate the string as real code.
  'no-eval': 'error',
  // Disallow the implied-`eval` forms: a string first argument to `setTimeout`,
  // `setInterval`, `setImmediate`, or `execScript`. Passing a string there makes
  // the engine `eval` it on the timer's behalf, so it carries every hazard of
  // `no-eval` above while hiding behind an everyday timer API — `setTimeout('do()',
  // 100)` reads as a scheduled call but is really deferred string execution. The
  // safe form is already the idiomatic one: pass a function, `setTimeout(() =>
  // do(), 100)`. This pairs with `no-eval` to cover the indirect channel the
  // direct ban misses. Not auto-fixable: only the author can turn the string
  // into the intended callback.
  'no-implied-eval': 'error',
  // Disallow `javascript:` URLs — `href = 'javascript:void(0)'`,
  // `window.location = 'javascript:doThing()'`, a `<a href="javascript:...">`.
  // The string after the `javascript:` scheme is handed to the engine and run
  // exactly as `eval` would run it, so it carries every hazard of `no-eval` and
  // `no-implied-eval` above — opaque to the parser, the type checker and every
  // reader, and a code-injection hole the moment any of it comes from untrusted
  // input — while wearing the everyday disguise of a URL. It is the third
  // channel in the string-executes-as-code family this config already bans:
  // `no-eval` (direct), `no-new-func` (the `Function` constructor) and
  // `no-implied-eval` (string-bodied timers); `no-script-url` closes the URL
  // channel the other three miss. There is a plain, safe equivalent for every
  // legitimate use — an `onClick`/event handler, `href="#"` with
  // `preventDefault`, or a real function — so the `javascript:` form buys
  // nothing but risk, and it is exactly the placeholder shortcut an AI assistant
  // emits for a "do-nothing" link. It is not in `eslint:recommended`, so it is
  // enabled explicitly. Not auto-fixable: only the author can replace the URL
  // with the intended handler.
  'no-script-url': 'error',
  // Disallow stray `console` calls, allowing only `console.warn` and
  // `console.error`. A bare `console.log` is almost always leftover debugging:
  // it slips through review, ships to production, leaks internal state into logs
  // and slows hot paths, all without any type error or runtime failure to flag
  // it — exactly the quiet, wrong-to-ship mistake this config exists to catch
  // and one AI assistants emit liberally while "checking what a value is." The
  // `allow: ['warn', 'error']` exception keeps intentional diagnostics — the two
  // `console` channels meant for surfacing problems — available, so the rule
  // targets only the throwaway logging. Consumers that genuinely build a CLI can
  // relax it for their entry points; for everyone else it is a zero-config
  // guard. The rule is not auto-fixable because only the author knows whether a
  // given `console.log` should be deleted or promoted to a real log channel.
  'no-console': ['error', { allow: ['warn', 'error'] }],
  // Disallow the `debugger` statement. A `debugger` left in source pauses
  // execution under an attached devtools/inspector and is otherwise a no-op, so
  // it is purely a debugging artifact that should never reach a commit — the
  // statement-shaped sibling of the throwaway `console.log` that `no-console`
  // directly above already bans. It is invisible to the type checker and most
  // code review, ships silently, and is exactly the leftover an AI assistant
  // emits while "stepping through" a problem. `eslint-config-agent` does not
  // extend `eslint:recommended` (where this rule lives), so it must be enabled
  // explicitly. The rule is auto-fixable — `eslint --fix` deletes the
  // statement — so adoption is cheap. Several of my repos (e.g.
  // `tupe12334/animals-shop`) re-add `no-debugger: 'error'` by hand on top of
  // the shared config; porting it here removes that copy-paste.
  'no-debugger': 'error',
  // Disallow `alert()`, `confirm()`, and `prompt()`. These browser dialog APIs
  // are exclusively debugging artifacts: `alert(value)` is the browser-native
  // counterpart of `console.log` — a quick "did I reach here / what is this
  // value?" check — but one that blocks the UI thread and cannot be silenced in
  // production without a runtime patch to `window.alert`. Like `no-console` and
  // `no-debugger` directly above, the rule exists to prevent leftover debugging
  // scaffolding from reaching a commit: the three rules together guard every
  // major "quick check" channel that AI assistants reach for when they want to
  // inspect state or get user input inline without wiring a real UI or log
  // channel. `confirm` and `prompt` are included because they carry the same
  // blocking, production-hostile behavior and are equally likely to appear in
  // AI-generated event handlers ("just pop a confirm dialog for now"). The rule
  // is not in `eslint:recommended`, so it must be enabled explicitly. It is not
  // auto-fixable because only the author knows whether the call should be
  // deleted, replaced with a proper log, or wired to a real modal component.
  'no-alert': 'error',
  // Require a regex literal (`/\d+/`) instead of the `RegExp` constructor with
  // a string argument (`new RegExp('\\d+')`, `RegExp('\\d+')`) when the pattern
  // is a static string. The string form forces every backslash to be escaped
  // twice — once for the string literal and once for the regex engine — so
  // `\d` has to be written `\\d`, `\.` becomes `\\.`, and a single missed
  // backslash silently changes what the pattern matches without any error.
  // The literal needs none of that doubling and is checked for validity at
  // parse time rather than when the constructor runs, so a malformed pattern
  // surfaces immediately instead of throwing on first use. This is the
  // regex-shaped sibling of the constructor bans this config already ships —
  // `no-object-constructor`, `no-new-wrappers`, `no-new-func` — all of which
  // reject a constructor call dressed up as a literal/value; reaching for
  // `new RegExp('...')` on a constant pattern is exactly the legacy,
  // double-escaping-prone idiom an AI assistant emits when asked to "build a
  // regex." It is not in `eslint:recommended`, so it is enabled explicitly.
  // `disallowRedundantWrapping: true` also flags `new RegExp(/foo/)` — wrapping
  // a literal that is already a regex — which is pure redundancy. The dynamic
  // `new RegExp(variable)` case, where the pattern genuinely is not known until
  // runtime, is left untouched. The rule is auto-fixable for the simple cases,
  // so consumers can adopt much of it with `eslint --fix`.
  'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
  // Require named capture groups (`(?<year>\d{4})`) instead of positional ones
  // (`(\d{4})`). An unnamed capture group is referenced by a fragile positional
  // index — `match[1]`, `match[2]` — whose meaning evaporates the moment a
  // group is added, removed, or reordered: `match[1]` silently shifts to a
  // different piece of the string with no type error and no runtime warning.
  // Named groups surface the intent in the regex itself (`(?<year>\d{4})`) and
  // are accessed by key (`match.groups.year`), so the code stays readable and
  // correct even as the pattern evolves. This is the regex-shaped sibling of
  // the explicit-over-clever stance this config already enforces in the rest of
  // the rule set: an unnamed group is exactly the "I'll remember what index 2
  // means" shortcut that doesn't age and that AI assistants emit by default
  // whenever they scaffold a regex. Non-capturing groups (`(?:...)`) are
  // unaffected — only groups that capture and expose a match need a name. The
  // rule is not in `eslint:recommended` and is not covered by
  // `unicorn.configs.all`, so it is enabled explicitly here. It is not
  // auto-fixable because only the author knows what name to give each group.
  'prefer-named-capture-group': 'error',
  // Disallow the comma operator — `a = 1, b = 2`, `for (i = 0, j = 0; ...)`,
  // `return a++, b`. The comma operator evaluates both operands left-to-right
  // and returns the *right-hand* value, silently discarding the left. That is
  // almost never intentional: in almost every real occurrence the author either
  // meant a semicolon (two separate statements), an array literal, or a
  // destructuring assignment — the comma operator just lets the mistake compile
  // without error. It is the hidden-mutation sibling of the assignment
  // discipline rules already here (`no-multi-assign`, `no-return-assign`,
  // `no-useless-assignment`): all of them surface values that look meaningful
  // but are silently discarded or overwritten, exactly the "clever but wrong"
  // pattern this config exists to prevent and one AI assistants emit when
  // packing multiple side effects onto a single expression. The one legitimate
  // use — `for` loop initializers and updates with multiple variables — is
  // carved out by the `allowInParentheses: false` default (the option only
  // affects the parenthesized `(a, b)` form used to suppress some parsers).
  // For `for` loop heads that genuinely need two counters, a destructuring
  // `let [i, j] = [0, 0]` states the intent clearly. The rule is not in
  // `eslint:recommended`, so it is enabled explicitly here. It is not
  // auto-fixable because only the author knows whether to split into separate
  // statements or rewrite the expression entirely.
  'no-sequences': 'error',
  // Disallow empty constructors (`class Foo { constructor() {} }`) and
  // constructors whose only statement forwards all arguments to `super`
  // (`class Foo extends Bar { constructor(...args) { super(...args); } }`). In
  // both cases the constructor adds nothing: JavaScript already synthesizes an
  // implicit empty constructor for base classes and an implicit forwarding
  // constructor for subclasses, so writing them out is pure dead weight — visual
  // noise that looks load-bearing but changes nothing. They are boilerplate an
  // AI assistant reflexively emits when scaffolding a class from a template,
  // putting them squarely in this config's explicit-over-clever, "dead code is
  // not free" stance: the class-declaration siblings of `no-useless-return`,
  // `no-useless-assignment`, and `no-extra-bind` already active here. The rule
  // is auto-fixable, so adopters get a one-shot `eslint --fix`. The core rule
  // is enabled here for JavaScript files; TypeScript files get the same
  // behavior via `@typescript-eslint/no-useless-constructor` enabled by the
  // `strictTypeChecked` preset (which extends `recommended`), so the core rule
  // is turned off in `typescriptEslintRules` to avoid double-reporting.
  'no-useless-constructor': 'error',
}

// Shared no-restricted-syntax rules for both JS and TS
const sharedRestrictedSyntax = [
  allRules.noNullishCoalescingConfig,
  {
    selector:
      'ExportNamedDeclaration[exportKind=type]:not([source]):has(ExportSpecifier)',
    message:
      "Type-only exports are not allowed. Use regular export or re-export with 'from' clause.",
  },
  {
    selector: 'ExportSpecifier[local.name=default][exported.name!=default]',
    message:
      'Re-exporting default as named export is not allowed. Use explicit export declaration instead.',
  },
  {
    selector:
      'Program:has(ImportDeclaration) ExportNamedDeclaration:has(VariableDeclaration > VariableDeclarator[init.type=Identifier]):not(:has(ClassDeclaration))',
    message:
      "Exporting imported variables is not allowed. Use direct re-export with 'from' clause or define new values.",
  },
  ...allRules.switchCaseExplicitReturnConfigs,
  {
    selector: 'SwitchStatement > SwitchCase[test=null]',
    message:
      'Default cases are not allowed in switch statements. Handle all possible cases explicitly.',
  },
  {
    selector:
      'ExportNamedDeclaration[source.value=/^[a-z]/]:not([source.value=/^@/])',
    message:
      'Exporting from external libraries is not allowed. Only re-export from relative paths or scoped packages.',
  },
  allRules.noProcessEnvironmentPropertiesConfig,
  allRules.noExportSpecifiersConfig,
  ...allRules.noDefaultClassExportRules,
]

// TypeScript-specific no-restricted-syntax rules
const tsOnlyRestrictedSyntax = [
  ...noRecordLiteralTypesConfigs,
  ...noInlineUnionTypesConfigs,
  allRules.noTypeAssertionsConfig,
  {
    selector: 'TSAsExpression:has(> TSIndexedAccessType > TSTypeQuery)',
    message:
      'Type assertions with indexed access types like "as (typeof X)[number]" are not allowed. Use a named type instead.',
  },
  ...allRules.switchCaseFunctionsReturnTypeConfigs,
  ...allRules.switchStatementsReturnTypeConfigs,
  ...allRules.noTrivialTypeAliasesConfigs,
]

const config = defineConfig([
  // Global ignores for non-JS/TS files and build outputs.
  //
  // Build-output globs are prefixed with `**/` so they match nested package
  // directories, not just the repository root. A bare `dist/**` only ignores
  // a top-level `dist/`, which means in a monorepo every `packages/*/dist/**`
  // (and the same for `build`, `coverage`, etc.) is still linted and floods
  // adopters with errors on generated code. The recursive form ignores those
  // outputs wherever they appear, matching the monorepo support this config
  // documents.
  {
    name: 'agent/ignores',
    ignores: [
      '**/*.json',
      '**/*.md',
      '**/*.yaml',
      '**/*.yml',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.next/**',
      '**/out/**',
      // Storybook's static build output. This config ships first-class
      // Storybook support (`eslint-plugin-storybook` + `configs/storybook.js`),
      // so adopters routinely run `storybook build`, which emits compiled,
      // minified bundles into `storybook-static/`. Linting that generated
      // output is never useful and floods the report, so ignore it like the
      // other build dirs above.
      '**/storybook-static/**',
      // Turborepo's local task cache. In the monorepos this config targets,
      // `turbo` writes hashed cache artifacts into `.turbo/`; they are
      // generated, not source, and must not be linted.
      '**/.turbo/**',
    ],
  },
  // Flag `eslint-disable` directives that no longer suppress anything. Stale
  // suppressions hide the fact that a rule is now satisfied (or was renamed)
  // and quietly widen the set of unchecked code over time, which runs against
  // this config's explicit-over-clever goal. Reporting them as errors keeps
  // every suppression honest and removable.
  {
    name: 'agent/linter-options',
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  // Global plugin definitions
  {
    name: 'agent/plugins',
    plugins,
  },
  {
    name: 'agent/react-hooks',
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  js.configs.recommended,
  unicorn.configs.all,
  // Disable unicorn rules that are too opinionated or conflict with this
  // codebase's conventions. These are turned off globally after
  // `unicorn.configs.all` enables them.
  {
    name: 'agent/unicorn-overrides',
    rules: {
      // Prevents `class`-prefixed identifiers like `classExportPlugin`,
      // `classDeclaration`, etc. — common in ESLint plugin code where `class`
      // is part of a domain concept, not a keyword accident.
      'unicorn/no-keyword-prefix': 'off',
      // Disallows `null` in favor of `undefined`. TypeScript APIs use `null`
      // intentionally (e.g. `null` vs `undefined` in type narrowing).
      'unicorn/no-null': 'off',
      // Prevents passing a function reference directly to `.map(fn)`. The
      // direct reference form is idiomatic and readable.
      'unicorn/no-array-callback-reference': 'off',
      // Enforces specific import styles for some packages (e.g. named vs
      // default). Too opinionated for this config's consumers.
      'unicorn/import-style': 'off',
    },
  },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    name: 'agent/typescript-parser-options',
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
    name: 'agent/javascript-disable-type-checked',
  },
  earlyReturn.configs.recommended,
  jsdoc.configs['flat/recommended-typescript-error'],
  // The jsdoc recommended preset only requires JSDoc on FunctionDeclaration by
  // default. Treat class declarations the same as functions so exported
  // classes are also required to be documented.
  {
    name: 'agent/jsdoc-require-class-jsdoc',
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ClassDeclaration: true,
            FunctionDeclaration: true,
          },
        },
      ],
    },
  },
  {
    plugins: { 'switch-case': switchCase },
    ...switchCase.configs.recommended,
    name: 'agent/switch-case',
  },

  // Base plugin strict configs (error, default, guard-clauses)
  ...basePluginsConfig,

  // TypeScript file configurations
  ...typescriptConfig(
    sharedRules,
    sharedRestrictedSyntax,
    tsOnlyRestrictedSyntax
  ),

  // TSX file configurations
  ...tsxConfig(sharedRules, sharedRestrictedSyntax, tsOnlyRestrictedSyntax),

  // JavaScript file configurations
  ...javascriptConfig(sharedRules, sharedRestrictedSyntax),

  // JSX file configurations
  ...jsxConfig(sharedRules, sharedRestrictedSyntax),

  // Test and spec files configuration
  ...testFilesConfig,

  // Configuration files
  ...configFilesConfig,

  // Storybook files configuration
  ...storybookConfig,

  // Examples files configuration
  ...examplesConfig,

  // className requirement for JSX files (strict: errors + rejects Tailwind-only classNames)
  {
    ...jsxClassname.configs.strict,
    files: ['**/*.{tsx,jsx}'],
    ignores: ['**/*.stories.{js,jsx,ts,tsx}'],
    name: 'agent/jsx-classname-strict',
  },

  // Final overrides (index files, switch case, length rules)
  ...overridesConfig(sharedRestrictedSyntax, tsOnlyRestrictedSyntax),
])

export default config
