/**
 * JavaScript File Configurations
 *
 * Handles all JavaScript (.js) file-specific rules.
 * Plugin registration removed - all plugins registered globally in index.js.
 */

import globals from "globals";

export const javascriptConfig = (sharedRules, sharedRestrictedSyntax) => [
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
          variable: false,
          function: false,
          class: true,
          interface: false,
          type: false,
          enum: false,
          ignorePrivate: true,
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
];
