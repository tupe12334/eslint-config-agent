/**
 * Base Plugin Configurations
 *
 * Applies strict configs from error, default, and ddd plugins.
 * These apply globally to all file types.
 */

import { plugins } from "../plugins/index.js";

export const basePluginsConfig = [
  // Error handling plugin strict config
  {
    rules: {
      ...plugins.error.configs.strict.rules,
    },
  },
  // Default plugin strict config
  plugins.default.configs.strict,
  // DDD plugin - require spec files for all source files
  {
    rules: {
      "ddd/require-spec-file": ["error", {
        excludePatterns: [
          "**/*.spec.js",
          "**/*.spec.ts",
          "**/*.test.js",
          "**/*.test.ts",
          "**/index.js",
          "**/index.ts",
          "**/*.d.ts",
          "**/*.config.js",
          "**/*.config.ts",
          "**/eslint.config.js",
          "**/*.stories.{js,jsx,ts,tsx}",
        ],
      }],
    },
  },
  // Disable DDD for config infrastructure files
  {
    files: [
      "configs/**/*.js",
      "plugins/**/*.js",
      "exports/**/*.js",
      "scripts/**/*.js",
      "rules/**/examples/**/*",
      "rules/**/*.spec.js",
      "rules/**/*.spec.ts",
      "test/**/*",
    ],
    rules: {
      "ddd/require-spec-file": "off",
    },
  },
];
