// Invalid ESM JavaScript (.mjs) file.
// Nullish coalescing is banned by the shared no-restricted-syntax rules.
// Before .mjs support, this file silently escaped the JavaScript rule set.
// Now it is linted and the no-restricted-syntax rule reports the `??` operator.

const input = globalThis.value

export const fallback = input ?? 'default'
