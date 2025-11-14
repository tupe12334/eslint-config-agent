/**
 * JSX File Configurations
 *
 * Handles all JSX (.jsx) file-specific rules.
 * Plugin registration removed - all plugins registered globally in index.js.
 */

import globals from 'globals'
import allRules from '../rules/index.js'

export const jsxConfig = (sharedRules, sharedRestrictedSyntax) => [
  // JSX files with TypeScript support - Error rules
  {
    files: ['**/*.jsx'],
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
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...sharedRules,
      'no-undef': 'off',
      'single-export/single-export': 'off',
      'required-exports/required-exports': [
        'error',
        {
          variable: false,
          function: false,
          class: true,
          interface: false,
          type: false,
          enum: false,
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
        {
          selector:
            'ClassDeclaration:not(ExportNamedDeclaration > ClassDeclaration):not(ExportDefaultDeclaration > ClassDeclaration)',
          message:
            "Classes must be exported. Add 'export' before the class declaration.",
        },
      ],
    },
  },

  // JSX Warning Rules - Lower priority restricted syntax rules as warnings
  {
    files: ['**/*.jsx'],
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
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-undef': 'off',
      'single-export/single-export': 'off',
      'required-exports/required-exports': [
        'warn',
        {
          variable: false,
          function: false,
          class: true,
          interface: false,
          type: false,
          enum: false,
          ignorePrivate: true,
        },
      ],
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
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)) ~ ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)))',
          message:
            'Only one component export per JSX file is allowed (plus optionally one type/interface export).',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration[exportKind=type]:not([source]) ~ ExportNamedDeclaration[exportKind=type]:not([source]))',
          message:
            'Only one type export per JSX file is allowed (plus optionally one component export).',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration))',
          message:
            'Only one interface export per JSX file is allowed (plus optionally one component export).',
        },
        {
          selector:
            'Program:has(ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration))',
          message:
            'Only one type alias export per JSX file is allowed (plus optionally one component export).',
        },
      ],
    },
  },
]
