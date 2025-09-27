import allRules from "../rules/index.js";
import { noRecordLiteralTypesConfigs } from "../rules/no-record-literal-types/index.js";

// Shared rules for both JS and TS files
const sharedRules = {
  ...allRules.pluginRules,
  "object-curly-newline": "off",
  "no-shadow": "off",
  "comma-dangle": "off",
  "function-paren-newline": "off",
  quotes: "off",
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "max-lines-per-function": allRules.maxFunctionLinesWarning,
  "max-lines": allRules.maxFileLinesWarning,
  semi: "off",
  complexity: "off",
  "no-trailing-spaces": allRules.noTrailingSpacesConfig,
  "operator-linebreak": "off",
  "implicit-arrow-linebreak": "off",
  "arrow-body-style": "off",
  "no-continue": "off",
  // Additional built-in error handling rules
  "prefer-promise-reject-errors": "error",
};

// Shared no-restricted-syntax rules for both JS and TS
const sharedRestrictedSyntax = [
  {
    selector: "MemberExpression[optional=true]",
    message: "Optional chaining is not allowed.",
  },
  {
    selector: "CallExpression[optional=true]",
    message: "Optional chaining is not allowed.",
  },
  allRules.noNullishCoalescingConfig,
  {
    selector:
      "ExportNamedDeclaration[exportKind=type]:not([source]):has(ExportSpecifier)",
    message:
      "Type-only exports are not allowed. Use regular export or re-export with 'from' clause.",
  },
  {
    selector: "ExportSpecifier[local.name=default][exported.name!=default]",
    message:
      "Re-exporting default as named export is not allowed. Use explicit export declaration instead.",
  },
  {
    selector:
      "Program:has(ImportDeclaration) ExportNamedDeclaration:has(VariableDeclaration > VariableDeclarator[init.type=Identifier]):not(:has(ClassDeclaration))",
    message:
      "Exporting imported variables is not allowed. Use direct re-export with 'from' clause or define new values.",
  },
  {
    selector: "SwitchStatement > SwitchCase > ReturnStatement[argument=null]",
    message:
      "Switch case functions must provide an explicit return value. Default return values are not allowed.",
  },
  {
    selector:
      "SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]",
    message:
      "Switch case functions must provide an explicit return value. Default return values are not allowed.",
  },
  {
    selector: "SwitchStatement > SwitchCase[test=null]",
    message:
      "Default cases are not allowed in switch statements. Handle all possible cases explicitly.",
  },
  {
    selector:
      "ExportNamedDeclaration[source.value=/^[a-z]/]:not([source.value=/^@/])",
    message:
      "Exporting from external libraries is not allowed. Only re-export from relative paths or scoped packages.",
  },
  allRules.noProcessEnvPropertiesConfig,
  allRules.noExportSpecifiersConfig,
  ...allRules.noDefaultClassExportRules,
];

// TypeScript-specific no-restricted-syntax rules
const tsOnlyRestrictedSyntax = [
  ...noRecordLiteralTypesConfigs,
  {
    selector:
      "TSTypeAnnotation > TSUnionType:not(PropertyDefinition > .typeAnnotation > .typeAnnotation):not(TSPropertySignature > .typeAnnotation > .typeAnnotation)",
    message: "Use a named type declaration instead of inline union types.",
  },
  {
    selector:
      "TSPropertySignature > TSTypeAnnotation > TSUnionType:has(TSLiteralType)",
    message:
      "Interface properties with literal unions should use a named type declaration.",
  },
  {
    selector:
      "PropertyDefinition > TSTypeAnnotation > TSUnionType:has(TSLiteralType)",
    message:
      "Class properties with literal unions should use a named type declaration.",
  },
  allRules.noTypeAssertionsConfig,
  allRules.noClassPropertyDefaultsConfig,
  {
    selector: "TSAsExpression:has(> TSIndexedAccessType > TSTypeQuery)",
    message:
      'Type assertions with indexed access types like "as (typeof X)[number]" are not allowed. Use a named type instead.',
  },
  {
    selector:
      "SwitchStatement > SwitchCase ArrowFunctionExpression:not([returnType])",
    message:
      "Switch case arrow functions must have explicit return type annotations.",
  },
  {
    selector:
      "SwitchStatement > SwitchCase FunctionExpression:not([returnType])",
    message:
      "Switch case function expressions must have explicit return type annotations.",
  },
  {
    selector:
      "SwitchStatement > SwitchCase > BlockStatement ArrowFunctionExpression:not([returnType])",
    message:
      "Switch case arrow functions must have explicit return type annotations.",
  },
  {
    selector:
      "SwitchStatement > SwitchCase > BlockStatement FunctionExpression:not([returnType])",
    message:
      "Switch case function expressions must have explicit return type annotations.",
  },
  {
    selector: "FunctionDeclaration:has(SwitchStatement):not([returnType])",
    message:
      "Functions containing switch statements must have explicit return type annotations.",
  },
  {
    selector: "ArrowFunctionExpression:has(SwitchStatement):not([returnType])",
    message:
      "Arrow functions containing switch statements must have explicit return type annotations.",
  },
  {
    selector: "FunctionExpression:has(SwitchStatement):not([returnType])",
    message:
      "Function expressions containing switch statements must have explicit return type annotations.",
  },
];

// Test and spec files configuration
export const testFilesConfig = [
  // Disable function and file size limits for test and spec files
  {
    files: [
      "**/*.test.{js,jsx,ts,tsx}",
      "**/*.spec.{js,jsx,ts,tsx}",
      "**/test/**/*.{js,jsx,ts,tsx}",
      "**/tests/**/*.{js,jsx,ts,tsx}",
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
    ],
    ignores: [
      "**/long-function-test.tsx", // Exception: this file tests the max-lines rule itself
      "**/test/export/**", // Export tests should follow strict export rules
      "**/test/required-exports/**", // Required export tests should follow strict export rules
    ],
    rules: {
      "max-lines-per-function": "off",
      "max-lines": "off", // Ignore file length limits in test and spec files
      // Allow multiple exports in test files for testing import/export patterns
      "no-restricted-syntax": [
        "warn",
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "ExportNamedDeclaration[specifiers.length>1]:not([source])" &&
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))" &&
            rule.selector !==
              "ExportNamedDeclaration:not([source]):not(:has(VariableDeclaration)):not(:has(FunctionDeclaration)):not(:has(ClassDeclaration)):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)):not(:has(TSEnumDeclaration))"
        ),
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },

  // Test files that should have ERROR level rules but exclude export specifier rule
  {
    files: [
      "**/test/type-assertions/**",
      "**/test/test-optional.ts",
      "**/test/test-js-optional.js",
      "**/test/test-record-literals.ts",
      "**/test/no-env-access-test.ts",
      "**/test/import-export-rules.ts",
    ],
    rules: {
      "max-lines-per-function": "off",
      "no-restricted-syntax": [
        "error", // Error level for these test files
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
            "ExportNamedDeclaration:not([source]):not(:has(VariableDeclaration)):not(:has(FunctionDeclaration)):not(:has(ClassDeclaration)):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)):not(:has(TSEnumDeclaration))"
        ),
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },

  // Test files configuration with mixed severity levels
  {
    files: [
      "**/test/invalid.tsx", // Special handling for the main test file
      "**/test/single-export-valid.ts", // Allow export specifiers for import/group-exports testing
      "**/test/typescript-rules.ts", // Allow export specifiers for typescript rules testing
      "**/test/type-assertions/indexed-access-valid.ts", // Allow export specifiers for type assertions testing
    ],
    rules: {
      "max-lines-per-function": "off",
      "no-restricted-syntax": [
        "warn", // Base level for most rules
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "ExportNamedDeclaration[specifiers.length>1]:not([source])" &&
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))" &&
            rule.selector !==
              "ExportNamedDeclaration:not([source]):not(:has(VariableDeclaration)):not(:has(FunctionDeclaration)):not(:has(ClassDeclaration)):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)):not(:has(TSEnumDeclaration))"
        ),
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },

  // Disable file length rules for configuration and spec files
  {
    files: [
      "index.js", // Main configuration file
      "**/rules/**/*.spec.js", // Spec files in rules directory
      "**/scripts/**/*.js", // Script files
    ],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
    },
  },
];