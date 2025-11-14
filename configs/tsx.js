/**
 * TSX File Configurations
 *
 * Handles all TSX (.tsx) file-specific rules.
 * Plugin registration removed - all plugins registered globally in index.js.
 */

import globals from 'globals'
import allRules from '../rules/index.js'

export const tsxConfig = (
  sharedRules,
  sharedRestrictedSyntax,
  tsOnlyRestrictedSyntax
) => [
  // TSX files - Base config
  {
    files: ['**/*.tsx'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'pnpm-lock.yaml',
      '**/*.stories.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      ...sharedRules,
      ...allRules.typescriptEslintRules,
      'no-undef': 'off',
      'custom/no-default-class-export': 'error',
      'single-export/single-export': 'error',
      'required-exports/required-exports': [
        'error',
        {
          variable: false,
          function: false,
          class: true,
          interface: false,
          type: false,
          enum: true,
          ignorePrivate: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        ...sharedRestrictedSyntax,
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },

  // TSX Rules - Switch case rules as errors
  {
    files: ['**/*.tsx'],
    ignores: ['**/*.stories.{js,jsx,ts,tsx}'],
    rules: {
      ...sharedRules,
      'single-export/single-export': 'off',
      'required-exports/required-exports': [
        'error',
        {
          variable: false,
          function: false,
          class: true,
          interface: false,
          type: false,
          enum: true,
          ignorePrivate: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        ...allRules.switchCaseExplicitReturnConfigs,
        {
          selector: 'SwitchStatement > SwitchCase[test=null]',
          message:
            'Default cases are not allowed in switch statements. Handle all possible cases explicitly.',
        },
        ...allRules.switchCaseFunctionsReturnTypeConfigs,
        ...allRules.switchStatementsReturnTypeConfigs,
      ],
    },
  },

  // TSX Rules - Other rules as warnings to accommodate className check
  {
    files: ['**/*.tsx'],
    ignores: ['**/*.stories.{js,jsx,ts,tsx}'],
    rules: {
      'single-export/single-export': 'off',
      'no-restricted-syntax': [
        'warn',
        ...sharedRestrictedSyntax.filter(
          rule =>
            rule.selector !==
              'Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))' &&
            rule.selector !==
              'SwitchStatement > SwitchCase > ReturnStatement[argument=null]' &&
            rule.selector !==
              'SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]' &&
            rule.selector !== 'SwitchStatement > SwitchCase[test=null]'
        ),
        // TSX files: Allow max one type/interface export + one component export
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)) ~ ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)))',
          message:
            'Only one component export per TSX file is allowed (plus optionally one type/interface export).',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration[exportKind=type]:not([source]) ~ ExportNamedDeclaration[exportKind=type]:not([source]))',
          message:
            'Only one type export per TSX file is allowed (plus optionally one component export).',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration))',
          message:
            'Only one interface export per TSX file is allowed (plus optionally one component export).',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration))',
          message:
            'Only one type alias export per TSX file is allowed (plus optionally one component export).',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration) ~ ExportNamedDeclaration[exportKind=type]:not([source]))',
          message:
            'Cannot have both interface export and type-only export in the same TSX file.',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration) ~ ExportNamedDeclaration[exportKind=type]:not([source]))',
          message:
            'Cannot have both type alias export and type-only export in the same TSX file.',
        },
        ...tsOnlyRestrictedSyntax.filter(rule => {
          const switchCaseFunctionSelectors =
            allRules.switchCaseFunctionsReturnTypeConfigs.map(r => r.selector)
          const switchStatementFunctionSelectors =
            allRules.switchStatementsReturnTypeConfigs.map(r => r.selector)
          const switchCaseExplicitReturnSelectors =
            allRules.switchCaseExplicitReturnConfigs.map(r => r.selector)
          return ![
            ...switchCaseFunctionSelectors,
            ...switchStatementFunctionSelectors,
            ...switchCaseExplicitReturnSelectors,
          ].includes(rule.selector)
        }),
      ],
    },
  },
]
