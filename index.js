import js from '@eslint/js'
import earlyReturn from 'eslint-plugin-early-return'
import switchCase from 'eslint-plugin-switch-case'
import jsxClassname from 'eslint-plugin-jsx-classname'
import jsdoc from 'eslint-plugin-jsdoc'
import reactHooks from 'eslint-plugin-react-hooks'
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
  // Disallow an `else`/`else if` block when the preceding `if` already exits
  // the function via `return`. The `else` is dead weight: once the `if` branch
  // returns, the code after it is unreachable from that path, so wrapping the
  // remainder in `else` only adds a level of nesting that hides the real
  // control flow. This is the built-in companion to the `early-return` plugin
  // already enabled here — both push code toward flat, guard-clause style
  // instead of the deeply-nested if/else trees AI assistants tend to emit. The
  // rule is auto-fixable, so consumers can adopt it with `eslint --fix`.
  'no-else-return': ['error', { allowElseIf: false }],
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
  // Disallow nested ternaries. A ternary inside another ternary is the
  // archetypal "clever but unreadable" construct this config exists to
  // prevent: it collapses branching logic into a single dense expression that
  // is hard to scan and easy to get wrong, and it is one of the shortcuts AI
  // assistants reach for most. Forcing an `if`/`else` or an early return keeps
  // the control flow explicit.
  'no-nested-ternary': 'error',
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
  // Require strict equality (=== / !==). Loose equality performs implicit type
  // coercion, exactly the kind of "clever" shortcut this config exists to
  // prevent. Enforcing it in the shared config means consumers no longer have
  // to re-add it on top of the package.
  eqeqeq: ['error', 'always'],
  // Disallow reassigning function parameters and mutating their properties.
  // Reassigning a parameter decouples it from the caller's argument and hides the
  // function's real inputs; mutating a parameter's properties causes
  // action-at-a-distance bugs where a callee silently rewrites an object the
  // caller still holds. Both undermine this config's explicit-over-clever,
  // immutability-leaning stance, so treat parameters as read-only here.
  'no-param-reassign': ['error', { props: true }],
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
  allRules.noProcessEnvPropertiesConfig,
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
