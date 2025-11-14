/**
 * Rule configuration for no-record-literal-types
 *
 * This rule disallows using Record type with string literal keys in favor of
 * more specific interface or type definitions for better type safety and readability.
 *
 * The Record utility type with literal string keys can make code harder to understand
 * and maintain because it doesn't explicitly define the structure of the object.
 * Using specific interfaces or types provides better IntelliSense, type checking,
 * and documentation.
 *
 * Examples:
 * - ❌ Record<'name' | 'age', string>
 * - ❌ Record<'active', boolean>
 * - ❌ Record<'foo' | 'bar' | 'baz', number>
 * - ✅ interface UserInfo { name: string; age: string; }
 * - ✅ type Status = { active: boolean; }
 * - ✅ Record<string, unknown> (generic keys are allowed)
 *
 * @see https://eslint.org/docs/latest/rules/no-restricted-syntax
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
 */

const rule = 'error'

// First selector: matches TSLiteralType descendants of first param (catches literals inside unions)
const selectorNestedParams =
  'TSTypeReference[typeName.name="Record"] > TSTypeParameterInstantiation > .params:first-child TSLiteralType'

// Second selector: matches direct TSLiteralType as first param
const selectorFirstChild =
  'TSTypeReference[typeName.name="Record"] > TSTypeParameterInstantiation > TSLiteralType:first-child'

const message =
  'Avoid using Record with string literal keys. Use a more specific interface or type instead.'

/**
 * Export the complete rule configurations for no-restricted-syntax
 * Can be used in ESLint config as part of no-restricted-syntax rules
 */
const noRecordLiteralTypesNestedConfig = {
  selector: selectorNestedParams,
  message,
}

const noRecordLiteralTypesFirstChildConfig = {
  selector: selectorFirstChild,
  message,
}

/**
 * Combined rule configurations for comprehensive Record literal type prevention
 */
const noRecordLiteralTypesConfigs = [
  noRecordLiteralTypesNestedConfig,
  noRecordLiteralTypesFirstChildConfig,
]

// Consolidated exports
export {
  rule,
  selectorNestedParams,
  selectorFirstChild,
  message,
  noRecordLiteralTypesNestedConfig,
  noRecordLiteralTypesFirstChildConfig,
  noRecordLiteralTypesConfigs,
}

export default noRecordLiteralTypesConfigs
