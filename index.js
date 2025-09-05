import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import noTrailingSpacesConfig from "./rules/no-trailing-spaces/index.js";
import { maxFunctionLinesWarning, maxFunctionLinesError } from "./rules/max-function-lines/index.js";
import { maxFileLinesWarning, maxFileLinesError } from "./rules/max-file-lines/index.js";
import noEnvAccessRule from "./rules/no-env-access/index.js";

// Conditionally import preact plugin if available
let preactPlugin = null;
try {
  preactPlugin = (await import("eslint-plugin-preact")).default;
} catch (error) {
  // eslint-plugin-preact is not available
}


// Shared rules for both JS and TS files
const sharedRules = {
  "import/extensions": ["off"],
  "import/no-extraneous-dependencies": ["off"],
  "react/self-closing-comp": "off",
  "object-curly-newline": "off",
  "import/no-unresolved": "off",
  "import/no-absolute-path": "off",
  "no-shadow": "off",
  "react/destructuring-assignment": "off",
  "react/jsx-props-no-spreading": "off",
  "react/button-has-type": "off",
  "import/order": "off",
  "comma-dangle": "off",
  "function-paren-newline": "off",
  quotes: "off",
  "no-unused-vars": "off",
  "import/newline-after-import": "off",
  "import/first": "off",
  "import/prefer-default-export": "off",
  "react/react-in-jsx-scope": "off",
  "max-lines-per-function": maxFunctionLinesWarning,
  "max-lines": maxFileLinesWarning,
  "react/jsx-filename-extension": ["error", { extensions: [".tsx", ".jsx"] }],
  semi: "off",
  "react/function-component-definition": "off",
  "react/jsx-one-expression-per-line": "off",
  "react/no-unknown-property": "off",
  "react/jsx-no-target-blank": "off",
  "react/require-default-props": "off",
  complexity: "off",
  "no-trailing-spaces": noTrailingSpacesConfig,
  "operator-linebreak": "off",
  "implicit-arrow-linebreak": "off",
  "react/jsx-wrap-multilines": "off",
  "arrow-body-style": "off",
  "react/jsx-closing-bracket-location": "off",
  "no-continue": "off",
  "jsx-a11y/label-has-associated-control": "off",
  "react/jsx-no-useless-fragment": "off",
  "import/group-exports": "off",
  "import/no-default-export": "off",
  "custom-rules/no-env-access": "error",
};

// Shared no-restricted-syntax rules for both JS and TS
const sharedRestrictedSyntax = [
  {
    selector: "MemberExpression[optional=true]",
    message: "Optional chaining is not allowed.",
  },
  {
    selector:
      "MemberExpression[object.type='MemberExpression'][object.object.name='process'][object.property.name='env']",
    message:
      "Direct access to process.env properties is not allowed. Use a configuration object or environment validation instead.",
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
    selector: "ExportAllDeclaration",
    message: "Re-exports using 'export *' syntax are not allowed.",
  },
  {
    selector: "ExportNamedDeclaration[specifiers.length>1]:not([source])",
    message:
      "Multiple exports in a single statement suggest this file contains too much logic. Consider splitting logic units into separate files for better maintainability.",
  },
  {
    selector:
      "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))",
    message:
      "Multiple export statements suggest this file contains too much logic. Consider splitting logic units into separate files with single responsibilities.",
  },
  {
    selector:
      "ExportNamedDeclaration[exportKind=type]:not([source]):has(ExportSpecifier)",
    message:
      "Type-only exports are not allowed. Use regular export or re-export with 'from' clause.",
  },
  {
    selector:
      "ExportNamedDeclaration:not([source]):not([exportKind=type]):has(ExportSpecifier)",
    message:
      "Export specifiers without re-export are not allowed. Use direct export or re-export with 'from' clause.",
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
];

// Required export rules (always errors)
const requiredExportRules = [
  {
    selector: "ClassDeclaration:not(ExportNamedDeclaration > ClassDeclaration)",
    message:
      "Classes must be exported with named export. Use 'export class' instead of 'export default class'.",
  },
  {
    selector:
      "TSEnumDeclaration:not(ExportNamedDeclaration > TSEnumDeclaration)",
    message:
      "Enums must be exported with named export. Use 'export enum' instead of 'export default enum'.",
  },
  {
    selector: "ExportDefaultDeclaration > ClassDeclaration",
    message:
      "Default export of classes is not allowed. Use 'export class' instead of 'export default class'.",
  },
  {
    selector: "ExportDefaultDeclaration > TSEnumDeclaration",
    message:
      "Default export of enums is not allowed. Use 'export enum' instead of 'export default enum'.",
  },
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
  {
    selector:
      'TSAsExpression:not(:has(TSTypeReference[typeName.name="const"]))',
    message: 'Type assertions with "as" are not allowed except for "as const".',
  },
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
      "custom-rules": {
        rules: {
          "no-env-access": noEnvAccessRule,
        }
      },
    },
  },
  reactHooks.configs["recommended-latest"],
  {
    ignores: ["packages/auth-service-sdk/**"],
  },
  js.configs.recommended,

  // TypeScript and TSX files
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "pnpm-lock.yaml",
      "packages/auth-service-sdk/**",
      "packages/auth-service-sdk/src/core/**",
      "packages/auth-service-sdk/src/client/**",
      "packages/auth-service-sdk/src/*.gen.ts",
    ],
    languageOptions: {
      parser: tsParser,
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
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      import: importPlugin,
      ...(preactPlugin && { preact: preactPlugin }),
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      ...sharedRules,
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        {
          assertionStyle: "as",
          objectLiteralTypeAssertions: "allow-as-parameter",
        },
      ],
      "no-restricted-syntax": [
        "error",
        ...sharedRestrictedSyntax,
        ...tsOnlyRestrictedSyntax,
        ...requiredExportRules,
      ],
    },
  },

  // TypeScript/TSX Rules - Switch case rules as errors, other rules as warnings
  {
    files: ["**/*.tsx"],
    rules: {
      // Include all shared rules (like max-lines-per-function)
      ...sharedRules,
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
    rules: {
      "no-restricted-syntax": [
        "warn",
        // Include shared rules but remove the multiple exports restriction and switch case rules for TSX
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "ExportNamedDeclaration[specifiers.length>1]:not([source])" &&
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > ReturnStatement[argument=null]" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]" &&
            rule.selector !== "SwitchStatement > SwitchCase[test=null]"
        ),
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
        // Required export rules - these will be warnings in TSX since we can't mix severities
        ...requiredExportRules,
        // Add className warning rule
        {
          selector:
            'JSXOpeningElement:not([name.name=/^[A-Z]/]):not([name.name="Fragment"]):not(:has(JSXAttribute[name.name="className"]))',
          message: "UI elements should have a className attribute for styling.",
        },
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
      "packages/auth-service-sdk/**",
      "**/*.umd.js",
      "**/*.cjs",
      "**/*.mjs",
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
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...sharedRules,
      "no-restricted-syntax": [
        "error",
        ...sharedRestrictedSyntax,
        // Only class rules apply to JS files (no enums in JS)
        {
          selector:
            "ClassDeclaration:not(ExportNamedDeclaration > ClassDeclaration):not(ExportDefaultDeclaration > ClassDeclaration)",
          message:
            "Classes must be exported. Add 'export' before the class declaration.",
        },
      ],
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
      "packages/auth-service-sdk/**",
    ],
    languageOptions: {
      parser: tsParser,
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
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      import: importPlugin,
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
      "packages/auth-service-sdk/**",
    ],
    languageOptions: {
      parser: tsParser,
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
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      import: importPlugin,
      ...(preactPlugin && { preact: preactPlugin }),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-undef": "off", // TypeScript handles this
      "no-restricted-syntax": [
        "warn",
        // Include shared rules but remove the multiple exports restriction and switch case rules for JSX
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "ExportNamedDeclaration[specifiers.length>1]:not([source])" &&
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > ReturnStatement[argument=null]" &&
            rule.selector !==
              "SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]" &&
            rule.selector !== "SwitchStatement > SwitchCase[test=null]"
        ),
        // Add className warning rule for JSX
        {
          selector:
            'JSXOpeningElement:not([name.name=/^[A-Z]/]):not([name.name="Fragment"]):not(:has(JSXAttribute[name.name="className"]))',
          message: "UI elements should have a className attribute for styling.",
        },
      ],
    },
  },

  // Disable function size limits for test and spec files
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
      // Allow multiple exports in test files for testing import/export patterns
      "no-restricted-syntax": [
        "warn",
        ...sharedRestrictedSyntax.filter(
          (rule) =>
            rule.selector !==
              "ExportNamedDeclaration[specifiers.length>1]:not([source])" &&
            rule.selector !==
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))"
        ),
        ...tsOnlyRestrictedSyntax,
      ],
    },
  },

  // Test files configuration with mixed severity levels
  {
    files: [
      "**/test/invalid.tsx", // Special handling for the main test file
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
              "Program:has(ExportNamedDeclaration:not([source]) ~ ExportNamedDeclaration:not([source]))"
        ),
        ...tsOnlyRestrictedSyntax,
        // For TSX files, also include required export rules as warnings since we can't mix severities
        ...requiredExportRules,
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
    rules: {
      "no-restricted-syntax": [
        "error",
        // Process.env rule (applies to all file types)
        {
          selector:
            "MemberExpression[object.type='MemberExpression'][object.object.name='process'][object.property.name='env']",
          message:
            "Direct access to process.env properties is not allowed. Use a configuration object or environment validation instead.",
        },
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
      ],
    },
  },

  // Function and file length rules - strict error thresholds
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Function length: error at 70+ lines
      "max-lines-per-function": maxFunctionLinesError,
      // File length: error at 100+ lines
      "max-lines": maxFileLinesError,
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
];

export default config;
