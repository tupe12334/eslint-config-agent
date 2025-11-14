/**
 * Rule configuration for no-class-property-defaults
 *
 * This rule disallows class properties from having default values.
 * Forces explicit initialization in constructor or through methods.
 *
 * Examples:
 * - ❌ class User { name = 'default'; }
 * - ❌ class User { count = 0; }
 * - ❌ class User { items = []; }
 * - ✅ class User { name; constructor() { this.name = 'default'; } }
 * - ✅ class User { count; initialize() { this.count = 0; } }
 *
 * @see https://eslint.org/docs/latest/rules/no-restricted-syntax
 */

const rule = 'error'

const selector = 'PropertyDefinition[value]'

const message =
  'Class properties cannot have default values. Initialize properties in the constructor or through methods instead.'

/**
 * Export the complete rule configuration for no-restricted-syntax
 * Can be used in ESLint config as part of no-restricted-syntax rules:
 * "no-restricted-syntax": ["error", ...otherRules, noClassPropertyDefaultsConfig]
 */
const noClassPropertyDefaultsConfig = {
  selector,
  message,
}

// Consolidated exports
export { rule, selector, message, noClassPropertyDefaultsConfig }

export default noClassPropertyDefaultsConfig
