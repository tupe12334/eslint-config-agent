/**
 * Rule configuration for no-process-env-properties
 *
 * This rule disallows direct access to process.env properties (e.g., process.env.NODE_ENV)
 * while allowing the use of process.env as a whole object for validation purposes.
 *
 * Examples:
 * - ❌ process.env.NODE_ENV
 * - ❌ process.env.PORT
 * - ✅ validate(process.env)
 * - ✅ const { NODE_ENV } = process.env
 *
 * @see https://eslint.org/docs/latest/rules/no-restricted-syntax
 */

const rule = 'error'

const selector =
  "MemberExpression[object.type='MemberExpression'][object.object.name='process'][object.property.name='env']"

const message =
  'Direct access to process.env properties is not allowed. Use process.env as a whole object instead (e.g., validate(process.env)).'

/**
 * Export the complete rule configuration for no-restricted-syntax
 * Can be used in ESLint config as part of no-restricted-syntax rules:
 * "no-restricted-syntax": ["error", ...otherRules, noProcessEnvPropertiesConfig]
 */
const noProcessEnvPropertiesConfig = {
  selector,
  message,
}

// Consolidated exports
export { rule, selector, message, noProcessEnvPropertiesConfig }

export default noProcessEnvPropertiesConfig
