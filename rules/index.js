/**
 * Aggregated exports for all custom ESLint rules
 *
 * This file centralizes imports from all rule modules in the rules/ directory
 * and re-exports them for easier consumption by the main configuration.
 */

// Core rule configurations
import noTrailingSpacesConfig from "./no-trailing-spaces/index.js";
import { maxFunctionLinesWarning, maxFunctionLinesError } from "./max-function-lines/index.js";
import { maxFileLinesWarning, maxFileLinesError } from "./max-file-lines/index.js";

// Custom restricted syntax rules
import { noProcessEnvPropertiesConfig } from "./no-process-env-properties/index.js";
import { noTypeAssertionsConfig } from "./no-type-assertions/index.js";

// Plugin rule configurations
import { pluginRules } from "./plugin/index.js";
import { typescriptEslintRules } from "./plugin/typescript-eslint/index.js";

// Consolidated exports
const allRules = {
  // Core rule configurations
  noTrailingSpacesConfig,
  maxFunctionLinesWarning,
  maxFunctionLinesError,
  maxFileLinesWarning,
  maxFileLinesError,

  // Custom restricted syntax rules
  noProcessEnvPropertiesConfig,
  noTypeAssertionsConfig,

  // Plugin rule configurations
  pluginRules,
  typescriptEslintRules,
};

export default allRules;

// Named exports for backward compatibility
export {
  // Core rule configurations
  noTrailingSpacesConfig,
  maxFunctionLinesWarning,
  maxFunctionLinesError,
  maxFileLinesWarning,
  maxFileLinesError,

  // Custom restricted syntax rules
  noProcessEnvPropertiesConfig,
  noTypeAssertionsConfig,

  // Plugin rule configurations
  pluginRules,
  typescriptEslintRules,
};