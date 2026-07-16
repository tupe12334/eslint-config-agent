// Invalid CommonJS JavaScript (.cjs) file.
// Nullish coalescing is banned by the shared no-restricted-syntax rules.
// Before .cjs support, this file escaped the JavaScript config block entirely,
// so the operator was silently allowed. Now the file is linted and the
// no-restricted-syntax rule reports the `??` as an error.

const left = 'a'
const right = 'b'

export const combined = left ?? right
