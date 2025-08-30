import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

// Conditionally import preact plugin if available
let preactPlugin = null;
try {
  preactPlugin = (await import("eslint-plugin-preact")).default;
} catch (error) {
  // eslint-plugin-preact is not available
}

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});

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
  "max-lines-per-function": [
    "warn",
    { max: 100, skipBlankLines: true, skipComments: true },
  ],
  "react/jsx-filename-extension": [
    "error",
    { extensions: [".tsx", ".jsx"] },
  ],
  semi: "off",
  "react/function-component-definition": "off",
  "react/jsx-one-expression-per-line": "off",
  "react/no-unknown-property": "off",
  "react/jsx-no-target-blank": "off",
  "react/require-default-props": "off",
  complexity: "off",
  "no-trailing-spaces": "warn",
  "operator-linebreak": "off",
  "implicit-arrow-linebreak": "off",
  "react/jsx-wrap-multilines": "off",
  "arrow-body-style": "off",
  "react/jsx-closing-bracket-location": "off",
  "no-continue": "off",
  "jsx-a11y/label-has-associated-control": "off",
  "react/jsx-no-useless-fragment": "off",
  "import/group-exports": "warn",
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
    selector: "TSTypeAnnotation > TSUnionType",
    message:
      "Use a named type declaration instead of inline union types.",
  },
  {
    selector: 'TSAsExpression:not(:has(TSTypeReference[typeName.name="const"]))',
    message: 'Type assertions with "as" are not allowed except for "as const".',
  },
];

const config = [
  reactHooks.configs["recommended-latest"],
  {
    ignores: ["packages/auth-service-sdk/**"],
  },
  js.configs.recommended,

  // Node.js files
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
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
      ],
    },
  },

  // UI ClassName Warning Rule for TypeScript/TSX
  {
    files: ["**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: 'JSXOpeningElement:not([name.name=/^[A-Z]/]):not([name.name="Fragment"]):not(:has(JSXAttribute[name.name="className"]))',
          message: "UI elements should have a className attribute for styling.",
        },
      ],
    },
  },

  // JavaScript and JSX files
  {
    files: ["**/*.js", "**/*.jsx"],
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
      "no-restricted-syntax": [
        "error",
        ...sharedRestrictedSyntax,
      ],
    },
  },

  // UI ClassName Warning Rule for JavaScript/JSX
  {
    files: ["**/*.jsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: 'JSXOpeningElement:not([name.name=/^[A-Z]/]):not([name.name="Fragment"]):not(:has(JSXAttribute[name.name="className"]))',
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
    rules: {
      "max-lines-per-function": "off",
    },
  },
];

export default config;
