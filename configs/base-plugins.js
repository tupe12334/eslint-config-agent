/**
 * Base Plugin Configurations
 *
 * Applies strict configs from error, default, and guard-clauses plugins.
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
  // Guard clauses plugin strict config
  {
    rules: {
      ...plugins["guard-clauses"].configs.strict.rules,
    },
  },
];
