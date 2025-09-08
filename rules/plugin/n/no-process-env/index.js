/**
 * Rule configuration for n/no-process-env
 *
 * This rule disallows the use of process.env to encourage centralized configuration
 * management instead of scattered environment variable access throughout the codebase.
 *
 * @see https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-process-env.md
 */

const rule = "error";

const options = {};

/**
 * Export the complete rule configuration
 * Can be used in ESLint config as:
 * "n/no-process-env": noProcessEnvConfig
 */
const noProcessEnvConfig = [rule, options];

// Consolidated exports
export {
  rule,
  options,
  noProcessEnvConfig,
};

export default noProcessEnvConfig;