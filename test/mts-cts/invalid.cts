// Invalid CommonJS TypeScript (.cts) file.
// Type assertions are banned by the TypeScript-only restricted-syntax rules.
// Before .cts support, this file crashed ESLint ("rule which requires type
// information, but don't have parserOptions set"). Now it is linted and the
// no-restricted-syntax rule reports the assertion as an error.

const raw = 'value'

export const asserted = raw as unknown as number
