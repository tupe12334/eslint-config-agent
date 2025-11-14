/**
 * Rule configuration for no-type-assertions
 *
 * This rule disallows TypeScript type assertions using the "as" keyword,
 * except for "as const" which is allowed for creating readonly literal types.
 *
 * Examples:
 * - ❌ value as string
 * - ❌ value as User
 * - ❌ obj as { name: string }
 * - ✅ { mode: 'prod' } as const
 * - ✅ ['a', 'b'] as const
 *
 * @see https://eslint.org/docs/latest/rules/no-restricted-syntax
 */

const rule = 'error'

const selector =
  'TSAsExpression:not(:has(TSTypeReference[typeName.name="const"]))'

const message =
  'Type assertions with "as" are not allowed except for "as const".'

/**
 * Export the complete rule configuration for no-restricted-syntax
 * Can be used in ESLint config as part of no-restricted-syntax rules:
 * "no-restricted-syntax": ["error", ...otherRules, noTypeAssertionsConfig]
 */
const noTypeAssertionsConfig = {
  selector,
  message,
}

// Consolidated exports
export { rule, selector, message, noTypeAssertionsConfig }

export default noTypeAssertionsConfig
