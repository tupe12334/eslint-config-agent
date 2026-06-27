/**
 * Valid: `||` with a nullable type must NOT trigger prefer-nullish-coalescing.
 * This config deliberately bans `??` via no-restricted-syntax, so the rule
 * that suggests using `??` must be disabled.
 */
export const maybeString: string | null = null
export const result = maybeString || 'default'
