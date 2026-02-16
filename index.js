import js from '@eslint/js'
import earlyReturn from 'eslint-plugin-early-return'
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
  // Optional chaining restriction
  'no-optional-chaining/no-optional-chaining': 'error',
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
  allRules.noClassPropertyDefaultsConfig,
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
  // Global ignores for non-JS/TS files
  {
    ignores: ['**/*.json', '**/*.md', '**/*.yaml', '**/*.yml'],
  },
  // Global plugin definitions
  {
    plugins,
  },
  reactHooks.configs['recommended-latest'],
  js.configs.recommended,
  ...tseslint.configs.recommended,
  earlyReturn.configs.recommended,

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

  // Final overrides (index files, switch case, className, length rules)
  ...overridesConfig(sharedRestrictedSyntax, tsOnlyRestrictedSyntax),
])

export default config
