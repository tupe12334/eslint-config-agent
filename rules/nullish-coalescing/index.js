/**
 * Rule configuration for no-nullish-coalescing
 *
 * This rule disallows the nullish coalescing operator (??) in favor of explicit
 * null/undefined checks for better code clarity and debugging.
 *
 * The nullish coalescing operator (??) can make code harder to understand and debug
 * because it combines null and undefined checks in a way that may not be immediately
 * obvious to all developers.
 *
 * Examples:
 * - ❌ const result = value ?? 'default'
 * - ❌ const name = user?.name ?? 'Anonymous'
 * - ✅ const result = value !== null && value !== undefined ? value : 'default'
 * - ✅ const name = user?.name !== undefined ? user.name : 'Anonymous'
 *
 * @see https://eslint.org/docs/latest/rules/no-restricted-syntax
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
 */

const rule = "error";

const selector = 'LogicalExpression[operator="??"]';

const message = "Nullish coalescing operator (??) is not allowed. Use explicit null/undefined checks instead.";

/**
 * Export the complete rule configuration for no-restricted-syntax
 * Can be used in ESLint config as part of no-restricted-syntax rules:
 * "no-restricted-syntax": ["error", ...otherRules, noNullishCoalescingConfig]
 */
const noNullishCoalescingConfig = {
  selector,
  message,
};

// Consolidated exports
export {
  rule,
  selector,
  message,
  noNullishCoalescingConfig,
};

export default noNullishCoalescingConfig;