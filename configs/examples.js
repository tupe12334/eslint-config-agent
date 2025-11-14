/**
 * Examples Configuration
 *
 * ESLint configuration specifically for rule example files.
 * Applies to files in: rules/*\/examples/**\/*.ts
 *
 * These examples demonstrate rule violations (invalid/) and correct patterns (valid/).
 * All TypeScript rules are applied so errors are visible in IDEs.
 */

import globals from 'globals'
import allRules from '../rules/index.js'
import { noRecordLiteralTypesConfigs } from '../rules/no-record-literal-types/index.js'
import { noInlineUnionTypesConfigs } from '../rules/no-inline-union-types/index.js'

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

export const examplesConfig = [
  {
    files: ['**/rules/**/examples/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        ...sharedRestrictedSyntax,
        ...tsOnlyRestrictedSyntax,
      ],
      // Relax file/function length limits for concise examples
      'max-lines-per-function': 'off',
      'max-lines': 'off',
    },
  },
]
