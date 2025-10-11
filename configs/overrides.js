/**
 * Override Configurations
 *
 * Final overrides that apply to specific file patterns or provide strict enforcement.
 * These must come last in the config array to properly override earlier configs.
 */

import globals from "globals";
import allRules from "../rules/index.js";

export const overridesConfig = (sharedRestrictedSyntax, tsOnlyRestrictedSyntax) => [
  // Index files configuration - allow specific export patterns
  {
    files: [
      "**/index.{js,ts,tsx,jsx}",
      "**/test/index-files/**/*.{js,ts,tsx,jsx}",
    ],
    rules: {
      "import/no-default-export": "off",
      "no-restricted-syntax": [
        "error",
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "ExportNamedDeclaration[specifiers.length>1]:not([source])" &&
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))" &&
            rule.selector !==
              "ExportNamedDeclaration:not([source]):not([exportKind=type]):has(ExportSpecifier)" &&
            rule.selector !==
              "ExportNamedDeclaration[exportKind=type]:not([source]):has(ExportSpecifier)"
        ),
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },

  // Switch case rules as errors for all TypeScript/JSX files (must come last to override)
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "**/*.stories.{js,jsx,ts,tsx}",
      "**/test/**",
      "!**/test/export/**",
      "!**/test/required-exports/**",
      "!**/test/switch-case/**",
      "**/rules/**/index.js",
    ],
    rules: {
      "required-exports/required-exports": [
        "error",
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
      "no-restricted-syntax": [
        "error",
        ...allRules.switchCaseExplicitReturnConfigs,
        {
          selector: "SwitchStatement > SwitchCase[test=null]",
          message:
            "Default cases are not allowed in switch statements. Handle all possible cases explicitly.",
        },
        ...allRules.switchCaseFunctionsReturnTypeConfigs,
        ...allRules.switchStatementsReturnTypeConfigs,
        allRules.noNullishCoalescingConfig,
        {
          selector: 'TSAsExpression[typeAnnotation.type="TSIndexedAccessType"]',
          message:
            'Type assertions with indexed access types like "as (typeof X)[number]" are not allowed. Use a named type instead.',
        },
        allRules.noTypeAssertionsConfig,
        allRules.noClassPropertyDefaultsConfig,
        allRules.noProcessEnvPropertiesConfig,
        allRules.noExportSpecifiersConfig,
      ],
    },
  },

  // className requirement for JSX files
  {
    files: ["**/*.{tsx,jsx}"],
    ignores: ["**/*.stories.{js,jsx,ts,tsx}"],
    rules: {
      "custom/jsx-classname-required": "error",
    },
  },

  // Function and file length rules - strict error thresholds
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "**/*.stories.{js,jsx,ts,tsx}",
      "**/*.test.{js,jsx,ts,tsx}",
      "**/*.spec.{js,jsx,ts,tsx}",
      "**/test/**/*.{js,jsx,ts,tsx}",
      "**/tests/**/*.{js,jsx,ts,tsx}",
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
      "**/configs/**/*.{js,ts}",
      "*.config.{js,ts}",
      "eslint.config.{js,ts}",
    ],
    rules: {
      "max-lines-per-function": allRules.maxFunctionLinesError,
      "max-lines": allRules.maxFileLinesError,
    },
  },

  // Rules directory configuration - allow export specifiers for API definitions
  {
    files: ["**/rules/**/*.{js,ts}"],
    ignores: ["**/rules/**/examples/**"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
            "ExportNamedDeclaration:not([source]):not(:has(VariableDeclaration)):not(:has(FunctionDeclaration)):not(:has(ClassDeclaration)):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)):not(:has(TSEnumDeclaration))"
        ),
      ],
    },
  },
];
