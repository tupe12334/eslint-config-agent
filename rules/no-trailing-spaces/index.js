/**
 * Rule configuration for no-trailing-spaces
 *
 * This rule disallows trailing whitespace (spaces and tabs) at the end of lines.
 *
 * @see https://eslint.org/docs/latest/rules/no-trailing-spaces
 */

const rule = 'error'

const options = {
  skipBlankLines: false, // Don't skip checking empty lines
  ignoreComments: false, // Don't ignore trailing spaces in comments
}

/**
 * Export the complete rule configuration
 * Can be used in ESLint config as:
 * "no-trailing-spaces": noTrailingSpacesConfig
 */
const noTrailingSpacesConfig = [rule, options]

// Consolidated exports
export { rule, options, noTrailingSpacesConfig }

export default noTrailingSpacesConfig
