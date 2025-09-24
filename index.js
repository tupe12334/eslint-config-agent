import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import securityPlugin from "eslint-plugin-security";
import nPlugin from "eslint-plugin-n";
import classExportPlugin from "eslint-plugin-class-export";
import singleExportPlugin from "eslint-plugin-single-export";
import requiredExportsPlugin from "eslint-plugin-required-exports";
import storybookPlugin from "eslint-plugin-storybook";
import globals from "globals";
import allRules from "./rules/index.js";
import { noDefaultClassExportRule } from "./rules/no-default-class-export/index.js";
import errorPlugin from "eslint-plugin-error";

// Conditionally import preact plugin if available
let preactPlugin = null;
try {
  preactPlugin = (await import("eslint-plugin-preact")).default;
} catch {
  // eslint-plugin-preact is not available
}

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
  {
    selector: 'LogicalExpression[operator="??"]',
    message:
      "Nullish coalescing operator (??) is not allowed. Use explicit null/undefined checks instead.",
  },
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
  {
    selector:
      'TSTypeReference[typeName.name="Record"] > TSTypeParameterInstantiation > .params:first-child TSLiteralType',
    message:
      "Avoid using Record with string literal keys. Use a more specific interface or type instead.",
  },
  {
    selector:
      'TSTypeReference[typeName.name="Record"] > TSTypeParameterInstantiation > TSLiteralType:first-child',
    message:
      "Avoid using Record with string literal keys. Use a more specific interface or type instead.",
  },
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

const config = [
  // Global plugin definitions
  {
    plugins: {
      n: nPlugin,
      "class-export": classExportPlugin,
      "single-export": singleExportPlugin,
      "required-exports": requiredExportsPlugin,
      error: errorPlugin,
      custom: {
        rules: {
          "no-default-class-export": noDefaultClassExportRule,
          "jsx-classname-required": allRules.jsxClassNameRequiredRule,
        },
      },
    },
  },
  // Use recommended-latest if available (v5+), otherwise create flat config equivalent of legacy recommended
  ...(reactHooks.configs["recommended-latest"]
    ? [reactHooks.configs["recommended-latest"]]
    : [
        {
          name: "react-hooks/recommended-flat",
          plugins: {
            "react-hooks": reactHooks,
          },
          rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
          },
        },
      ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Error handling plugin strict config
  {
    plugins: {
      error: errorPlugin,
    },
    rules: {
      ...errorPlugin.configs.strict.rules,
    },
  },

  // TypeScript and TSX files
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "pnpm-lock.yaml",
      "**/*.stories.{js,jsx,ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      security: securityPlugin,
      n: nPlugin,
      "class-export": classExportPlugin,
      ...(preactPlugin && { preact: preactPlugin }),
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      ...sharedRules,
      ...allRules.typescriptEslintRules,
      "no-undef": "off", // TypeScript handles this
      "custom/no-default-class-export": "error",
      "single-export/single-export": "error",
      "required-exports/required-exports": [
        "error",
        {
          variable: false, // Don't require exporting variables/constants
          function: false, // Don't require exporting functions
          class: true, // Require exporting classes (matches old behavior)
          interface: false, // Don't require exporting interfaces
          type: false, // Don't require exporting types
          enum: true, // Require exporting enums (matches old behavior)
          ignorePrivate: true, // Ignore declarations starting with _
        },
      ],
      "no-restricted-syntax": [
        "error",
        ...sharedRestrictedSyntax,
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },

  // TypeScript/TSX Rules - Switch case rules as errors, other rules as warnings
  {
    files: ["**/*.tsx"],
    ignores: ["**/*.stories.{js,jsx,ts,tsx}"],
    rules: {
      // Include all shared rules (like max-lines-per-function)
      ...sharedRules,
      "single-export/single-export": "off", // TSX files have their own specific export rules
      "required-exports/required-exports": [
        "error",
        {
          variable: false, // Don't require exporting variables/constants
          function: false, // Don't require exporting functions
          class: true, // Require exporting classes (matches old behavior)
          interface: false, // Don't require exporting interfaces
          type: false, // Don't require exporting types
          enum: true, // Require exporting enums (matches old behavior)
          ignorePrivate: true, // Ignore declarations starting with _
        },
      ],
      "no-restricted-syntax": [
        "error",
        // Switch case rules as errors
        {
          selector:
            "SwitchStatement > SwitchCase > ReturnStatement[argument=null]",
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
          selector:
            "FunctionDeclaration:has(SwitchStatement):not([returnType])",
          message:
            "Functions containing switch statements must have explicit return type annotations.",
        },
        {
          selector:
            "ArrowFunctionExpression:has(SwitchStatement):not([returnType])",
          message:
            "Arrow functions containing switch statements must have explicit return type annotations.",
        },
        {
          selector: "FunctionExpression:has(SwitchStatement):not([returnType])",
          message:
            "Function expressions containing switch statements must have explicit return type annotations.",
        },
      ],
    },
  },

  // TypeScript/TSX Rules - Other rules as warnings to accommodate className check
  {
    files: ["**/*.tsx"],
    ignores: ["**/*.stories.{js,jsx,ts,tsx}"],
    rules: {
      "single-export/single-export": "off", // TSX files have their own specific export rules
      "no-restricted-syntax": [
        "warn",
        // Include shared rules but remove the multiple exports restriction and switch case rules for TSX
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > ReturnStatement[argument=null]" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]" &&
            rule.selector !== "SwitchStatement > SwitchCase[test=null]"
        ),
        // TSX files: Allow max one type/interface export + one component export
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)) ~ ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)))",
          message:
            "Only one component export per TSX file is allowed (plus optionally one type/interface export).",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration[exportKind=type]:not([source]) ~ ExportNamedDeclaration[exportKind=type]:not([source]))",
          message:
            "Only one type export per TSX file is allowed (plus optionally one component export).",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration))",
          message:
            "Only one interface export per TSX file is allowed (plus optionally one component export).",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration))",
          message:
            "Only one type alias export per TSX file is allowed (plus optionally one component export).",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration) ~ ExportNamedDeclaration[exportKind=type]:not([source]))",
          message:
            "Cannot have both interface export and type-only export in the same TSX file.",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration) ~ ExportNamedDeclaration[exportKind=type]:not([source]))",
          message:
            "Cannot have both type alias export and type-only export in the same TSX file.",
        },
        ...tsOnlyRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "SwitchStatement > SwitchCase ArrowFunctionExpression:not([returnType])" &&
            rule.selector !==
              "SwitchStatement > SwitchCase FunctionExpression:not([returnType])" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > BlockStatement ArrowFunctionExpression:not([returnType])" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > BlockStatement FunctionExpression:not([returnType])" &&
            rule.selector !==
              "FunctionDeclaration:has(SwitchStatement):not([returnType])" &&
            rule.selector !==
              "ArrowFunctionExpression:has(SwitchStatement):not([returnType])" &&
            rule.selector !==
              "FunctionExpression:has(SwitchStatement):not([returnType])"
        ),
      ],
    },
  },

  // JavaScript files (not JSX)
  {
    files: ["**/*.js"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "pnpm-lock.yaml",
      "**/*.umd.js",
      "**/*.cjs",
      "**/*.mjs",
      "**/*.stories.{js,jsx,ts,tsx}",
      "**/rules/**/index.js",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      security: securityPlugin,
      n: nPlugin,
      "class-export": classExportPlugin,
      "single-export": singleExportPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...sharedRules,
      "single-export/single-export": "error",
      "required-exports/required-exports": [
        "error",
        {
          variable: false, // Don't require exporting variables/constants
          function: false, // Don't require exporting functions
          class: true, // Require exporting classes (matches old behavior)
          interface: false, // Don't require exporting interfaces (N/A for JS)
          type: false, // Don't require exporting types (N/A for JS)
          enum: false, // Don't require exporting enums (N/A for JS)
          ignorePrivate: true, // Ignore declarations starting with _
        },
      ],
      "no-restricted-syntax": ["error", ...sharedRestrictedSyntax],
    },
  },

  // Node.js files (must come after general JS config to override)
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...sharedRules,
      "no-restricted-syntax": ["error", ...sharedRestrictedSyntax],
    },
  },

  // JSX files with TypeScript support
  {
    files: ["**/*.jsx"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "pnpm-lock.yaml",
      "**/*.stories.{js,jsx,ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      security: securityPlugin,
      n: nPlugin,
      "class-export": classExportPlugin,
      "single-export": singleExportPlugin,
      ...(preactPlugin && { preact: preactPlugin }),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...sharedRules,
      "no-undef": "off", // TypeScript handles this
      "single-export/single-export": "off", // JSX files have their own specific export rules
      "required-exports/required-exports": [
        "error",
        {
          variable: false, // Don't require exporting variables/constants
          function: false, // Don't require exporting functions
          class: true, // Require exporting classes (matches old behavior)
          interface: false, // Don't require exporting interfaces (N/A for JSX)
          type: false, // Don't require exporting types (N/A for JSX)
          enum: false, // Don't require exporting enums (N/A for JSX)
          ignorePrivate: true, // Ignore declarations starting with _
        },
      ],
      "no-restricted-syntax": [
        "error",
        // Switch case rules as errors
        {
          selector:
            "SwitchStatement > SwitchCase > ReturnStatement[argument=null]",
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
          selector:
            "FunctionDeclaration:has(SwitchStatement):not([returnType])",
          message:
            "Functions containing switch statements must have explicit return type annotations.",
        },
        {
          selector:
            "ArrowFunctionExpression:has(SwitchStatement):not([returnType])",
          message:
            "Arrow functions containing switch statements must have explicit return type annotations.",
        },
        {
          selector: "FunctionExpression:has(SwitchStatement):not([returnType])",
          message:
            "Function expressions containing switch statements must have explicit return type annotations.",
        },
        // Required export rules as errors (class rule only for JSX)
        {
          selector:
            "ClassDeclaration:not(ExportNamedDeclaration > ClassDeclaration):not(ExportDefaultDeclaration > ClassDeclaration)",
          message:
            "Classes must be exported. Add 'export' before the class declaration.",
        },
      ],
    },
  },

  // JSX Warning Rules - Lower priority restricted syntax rules as warnings
  {
    files: ["**/*.jsx"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "pnpm-lock.yaml",
      "**/*.stories.{js,jsx,ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      security: securityPlugin,
      n: nPlugin,
      "class-export": classExportPlugin,
      "single-export": singleExportPlugin,
      ...(preactPlugin && { preact: preactPlugin }),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-undef": "off", // TypeScript handles this
      "single-export/single-export": "off", // JSX files have their own specific export rules
      "required-exports/required-exports": [
        "warn",
        {
          variable: false, // Don't require exporting variables/constants
          function: false, // Don't require exporting functions
          class: true, // Require exporting classes (matches old behavior)
          interface: false, // Don't require exporting interfaces (N/A for JSX)
          type: false, // Don't require exporting types (N/A for JSX)
          enum: false, // Don't require exporting enums (N/A for JSX)
          ignorePrivate: true, // Ignore declarations starting with _
        },
      ],
      "no-restricted-syntax": [
        "warn",
        // Include shared rules but remove the multiple exports restriction and switch case rules for JSX
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > ReturnStatement[argument=null]" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]" &&
            rule.selector !== "SwitchStatement > SwitchCase[test=null]"
        ),
        // JSX files: Allow max one type/interface export + one component export
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)) ~ ExportNamedDeclaration:not([source]):not([exportKind=type]):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)))",
          message:
            "Only one component export per JSX file is allowed (plus optionally one type/interface export).",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration[exportKind=type]:not([source]) ~ ExportNamedDeclaration[exportKind=type]:not([source]))",
          message:
            "Only one type export per JSX file is allowed (plus optionally one component export).",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSInterfaceDeclaration))",
          message:
            "Only one interface export per JSX file is allowed (plus optionally one component export).",
        },
        {
          selector:
            "Program:has(ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration) ~ ExportNamedDeclaration:not([source]):has(TSTypeAliasDeclaration))",
          message:
            "Only one type alias export per JSX file is allowed (plus optionally one component export).",
        },
      ],
    },
  },

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

  // Index files configuration - allow specific export patterns
  {
    files: [
      "**/index.{js,ts,tsx,jsx}",
      "**/test/index-files/**/*.{js,ts,tsx,jsx}",
    ],
    rules: {
      "import/no-default-export": "off",
      // Allow multiple re-exports in index files but keep other restrictions
      "no-restricted-syntax": [
        "error",
        // Keep most rules but allow multiple exports and export statements for index files
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
          variable: false, // Don't require exporting variables/constants
          function: false, // Don't require exporting functions
          class: true, // Require exporting classes (matches old behavior)
          interface: false, // Don't require exporting interfaces
          type: false, // Don't require exporting types
          enum: true, // Require exporting enums (matches old behavior)
          ignorePrivate: true, // Ignore declarations starting with _
        },
      ],
      "no-restricted-syntax": [
        "error",
        // Switch case rules as errors
        {
          selector:
            "SwitchStatement > SwitchCase > ReturnStatement[argument=null]",
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
          selector:
            "FunctionDeclaration:has(SwitchStatement):not([returnType])",
          message:
            "Functions containing switch statements must have explicit return type annotations.",
        },
        {
          selector:
            "ArrowFunctionExpression:has(SwitchStatement):not([returnType])",
          message:
            "Arrow functions containing switch statements must have explicit return type annotations.",
        },
        {
          selector: "FunctionExpression:has(SwitchStatement):not([returnType])",
          message:
            "Function expressions containing switch statements must have explicit return type annotations.",
        },
        {
          selector: "MemberExpression[optional=true]",
          message: "Optional chaining is not allowed.",
        },
        {
          selector: "CallExpression[optional=true]",
          message: "Optional chaining is not allowed.",
        },
        {
          selector: 'LogicalExpression[operator="??"]',
          message:
            "Nullish coalescing operator (??) is not allowed. Use explicit null/undefined checks instead.",
        },
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
    ],
    rules: {
      // Function length: error at 70+ lines
      "max-lines-per-function": allRules.maxFunctionLinesError,
      // File length: error at 100+ lines
      "max-lines": allRules.maxFileLinesError,
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

  // Allow default exports in configuration files (must be last to override)
  {
    files: [
      "*.config.js",
      "*.config.ts",
      "eslint.config.js",
      "eslint.config.ts",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },

  // Storybook files configuration - only use storybook plugin rules
  {
    files: ["**/*.stories.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      storybook: storybookPlugin,
    },
    rules: {
      // Enable recommended storybook rules only
      ...storybookPlugin.configs.recommended.rules,
    },
  },

  // Rules directory configuration - allow export specifiers for API definitions (but not examples)
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
        // Include all shared rules EXCEPT our export specifier rule
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
            "ExportNamedDeclaration:not([source]):not(:has(VariableDeclaration)):not(:has(FunctionDeclaration)):not(:has(ClassDeclaration)):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)):not(:has(TSEnumDeclaration))"
        ),
      ],
    },
  },
];

export default config;
