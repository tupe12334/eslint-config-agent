/**
 * Integration test for the `@typescript-eslint/method-signature-style` rule
 * shipped by eslint-config-agent.
 *
 * Method-shorthand signatures (`foo(x: T): R`) are checked bivariantly by
 * TypeScript — a documented unsoundness — while property-style signatures
 * (`foo: (x: T) => R`) are checked contravariantly (sound). The shared config
 * must flag method shorthands and leave property-style signatures alone.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const methodSigMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/method-signature-style'
  )
}

console.log('Testing method-signature-style rule from the shipped config...')

// Both method-shorthand signatures must be flagged.
const invalid = await methodSigMessages(
  'test/method-signature-style/invalid.ts'
)
assert.ok(
  invalid.length >= 2,
  `Expected both method shorthands to be flagged by method-signature-style, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'method-signature-style should be an error'
)

// Property-style signatures must not be flagged.
const valid = await methodSigMessages('test/method-signature-style/valid.ts')
assert.strictEqual(
  valid.length,
  0,
  'Did not expect property-style signatures to be flagged'
)

console.log('✅ All tests passed!')
