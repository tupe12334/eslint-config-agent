/**
 * Rule configuration for max-lines
 *
 * This rule enforces a maximum number of lines per file to encourage
 * smaller, more maintainable files and better separation of concerns.
 *
 * Warnings at >70 lines, errors at >100 lines
 *
 * @see https://eslint.org/docs/latest/rules/max-lines
 */

// Warning configuration (70 lines)
export const warningRule = "warn";
export const warningOptions = {
  max: 70,
  skipBlankLines: true,
  skipComments: true,
};

// Error configuration (100 lines)
export const errorRule = "error";
export const errorOptions = {
  max: 100,
  skipBlankLines: true,
  skipComments: true,
};

/**
 * Export the warning rule configuration (applied first)
 * Can be used in ESLint config as:
 * "max-lines": maxFileLinesWarning
 */
export const maxFileLinesWarning = [warningRule, warningOptions];

/**
 * Export the error rule configuration (applied later to override)
 * Can be used in ESLint config as:
 * "max-lines": maxFileLinesError
 */
export const maxFileLinesError = [errorRule, errorOptions];

// Default export is the warning configuration
export default maxFileLinesWarning;
