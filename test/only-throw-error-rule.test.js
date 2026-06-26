/**
 * Integration test for the `@typescript-eslint/only-throw-error` rule shipped
 * by eslint-config-agent via `strictTypeChecked`, and for the companion fix
 * that disables the core `no-throw-literal` rule for TypeScript files to
 * prevent double-reporting.
 *
 * For TypeScript files the config must:
 *   1. Flag throw statements whose value is not an `Error` (or `Error` subclass)
 *      via `@typescript-eslint/only-throw-error`.
 *   2. NOT report those same violations under `no-throw-literal` (the core rule
 *      is disabled for TS via `typescriptEslintRules` so the type-aware rule
 *      handles them exclusively).
 *   3. Accept throwing a real `Error` instance without a violation.
 *
 * The rule is type-aware, so the fixtures are real on-disk files resolved by
 * the TypeScript project service. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const messagesForFile = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages
}

console.log(
  'Testing @typescript-eslint/only-throw-error and no-throw-literal override for TS files...'
)

// --- invalid fixture ---
const invalidMessages = await messagesForFile(
  'test/only-throw-error/invalid-throw.ts'
)

const onlyThrowErrorViolations = invalidMessages.filter(
  m => m.ruleId === '@typescript-eslint/only-throw-error'
)
const noThrowLiteralViolations = invalidMessages.filter(
  m => m.ruleId === 'no-throw-literal'
)

assert.ok(
  onlyThrowErrorViolations.length >= 2,
  `Expected at least 2 @typescript-eslint/only-throw-error violations for invalid fixture, got ${onlyThrowErrorViolations.length}`
)
assert.strictEqual(
  onlyThrowErrorViolations[0].severity,
  2,
  '@typescript-eslint/only-throw-error should be an error'
)
assert.strictEqual(
  noThrowLiteralViolations.length,
  0,
  `Expected no-throw-literal to be disabled for .ts files (type-aware rule handles it), but got ${noThrowLiteralViolations.length} violation(s)`
)

// --- valid fixture ---
const validMessages = await messagesForFile(
  'test/only-throw-error/valid-throw.ts'
)
const validOnlyThrowError = validMessages.filter(
  m => m.ruleId === '@typescript-eslint/only-throw-error'
)
assert.strictEqual(
  validOnlyThrowError.length,
  0,
  `Did not expect @typescript-eslint/only-throw-error to flag throwing a real Error, got ${validOnlyThrowError.length} violation(s)`
)

console.log('✅ All tests passed!')
