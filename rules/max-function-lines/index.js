/**
 * Rule configuration for max-lines-per-function
 *
 * This rule enforces a maximum number of lines per function to encourage
 * smaller, more maintainable functions.
 *
 * Warnings at >50 lines, errors at >70 lines
 *
 * @see https://eslint.org/docs/latest/rules/max-lines-per-function
 */

// Warning configuration (50 lines)
const warningRule = "warn";
const warningOptions = {
  max: 50,
  skipBlankLines: true,
  skipComments: true,
};

// Error configuration (70 lines)
const errorRule = "error";
const errorOptions = {
  max: 70,
  skipBlankLines: true,
  skipComments: true,
};

/**
 * Export the warning rule configuration (applied first)
 * Can be used in ESLint config as:
 * "max-lines-per-function": maxFunctionLinesWarning
 */
const maxFunctionLinesWarning = [warningRule, warningOptions];

/**
 * Export the error rule configuration (applied later to override)
 * Can be used in ESLint config as:
 * "max-lines-per-function": maxFunctionLinesError
 */
const maxFunctionLinesError = [errorRule, errorOptions];

// Consolidated exports
export {
  warningRule,
  warningOptions,
  errorRule,
  errorOptions,
  maxFunctionLinesWarning,
  maxFunctionLinesError,
};

// Default export is the warning configuration
export default maxFunctionLinesWarning;
