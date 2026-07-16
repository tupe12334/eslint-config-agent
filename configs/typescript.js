/**
 * TypeScript File Configurations
 *
 * Handles all TypeScript (.ts, .mts, .cts) file-specific rules.
 * Plugin registration removed - all plugins registered globally in index.js.
 */

import globals from 'globals'
import allRules from '../rules/index.js'

export const typescriptConfig = (
  sharedRules,
  sharedRestrictedSyntax,
  tsOnlyRestrictedSyntax
) => [
  // TypeScript files - Base config
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
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
      'import/resolver': {
        typescript: {},
      },
      // Tell eslint-plugin-import to parse TypeScript dependency files with the
      // TS parser. Without this, the resolver finds the file but the plugin
      // cannot read its imports/exports, so cross-file rules like
      // import/no-cycle silently never fire on .ts/.tsx code.
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts'],
      },
    },
    rules: {
      ...sharedRules,
      ...allRules.typescriptEslintRules,
      'no-undef': 'off', // TypeScript handles this
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ClassDeclaration: true,
            FunctionDeclaration: true,
          },
        },
      ],
      'custom/no-default-class-export': 'error',
      // Require an explicit return type on every function, not just the
      // exported ones `explicit-module-boundary-types` would cover. Inferred
      // return types are computed bottom-up from the body, so a refactor deep
      // inside a helper can silently widen or change what it returns — a `null`
      // branch added here, a `Promise` introduced there — and nothing flags it
      // until that drift surfaces far away at a call site (or type-checks fine
      // and ships as a runtime bug). Writing the type down inverts the check:
      // the function body is now verified against the contract the author
      // declared, so the mistake fails at the function itself instead of
      // leaking outward. This is exactly the shortcut an AI assistant takes
      // when it emits a helper and lets inference "figure out" the return type,
      // which puts it squarely in this config's explicit-over-clever,
      // fail-locally stance. It is type-aware but cheap (it reads the function
      // signature, no whole-program analysis) and is in neither
      // `eslint:recommended` nor typescript-eslint's `strictTypeChecked` /
      // `stylisticTypeChecked` presets this config extends, so it must be
      // enabled explicitly — which is why `tools-view` re-adds it by hand on
      // top of the base config. It is scoped to `.ts`/`.mts`/`.cts` (this
      // file's `files`) and deliberately NOT applied to `.tsx`: requiring an
      // explicit return type on every JSX component is high-noise for little
      // gain, so React function components stay exempt, matching how
      // `tools-view` enables it on `src/**/*.ts` only.
      '@typescript-eslint/explicit-function-return-type': 'error',
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
]
