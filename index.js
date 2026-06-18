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
  // Disallow nested ternaries. A ternary inside another ternary is the
  // archetypal "clever but unreadable" construct this config exists to
  // prevent: it collapses branching logic into a single dense expression that
  // is hard to scan and easy to get wrong, and it is one of the shortcuts AI
  // assistants reach for most. Forcing an `if`/`else` or an early return keeps
  // the control flow explicit.
  'no-nested-ternary': 'error',
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
  // Global ignores for non-JS/TS files and build outputs
  {
    ignores: [
      '**/*.json',
      '**/*.md',
      '**/*.yaml',
      '**/*.yml',
      'dist/**',
      'coverage/**',
    ],
  },
  // Flag `eslint-disable` directives that no longer suppress anything. Stale
  // suppressions hide the fact that a rule is now satisfied (or was renamed)
  // and quietly widen the set of unchecked code over time, which runs against
  // this config's explicit-over-clever goal. Reporting them as errors keeps
  // every suppression honest and removable.
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  // Global plugin definitions
  {
    plugins,
  },
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
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
  },
  earlyReturn.configs.recommended,
  jsdoc.configs['flat/recommended-typescript-error'],
  // The jsdoc recommended preset only requires JSDoc on FunctionDeclaration by
  // default. Treat class declarations the same as functions so exported
  // classes are also required to be documented.
  {
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
  { plugins: { 'switch-case': switchCase }, ...switchCase.configs.recommended },

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
  },

  // Final overrides (index files, switch case, length rules)
  ...overridesConfig(sharedRestrictedSyntax, tsOnlyRestrictedSyntax),
])

export default config
