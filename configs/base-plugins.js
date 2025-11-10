/**
 * Base Plugin Configurations
 *
 * Applies strict configs from error and default plugins.
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
];
