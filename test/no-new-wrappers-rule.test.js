/**
 * Integration test for the `no-new-wrappers` rule shipped by eslint-config-agent.
 *
 * The shared config must reject the primitive-wrapper constructors
 * `new String()`, `new Number()`, and `new Boolean()` — they produce boxed
 * objects whose type and equality semantics surprise callers — while allowing
 * the plain conversion call forms (`String(x)`, `Number(x)`, `Boolean(x)`).
 * This guards against accidental removal of the rule and documents the intended
 * behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noNewWrappersMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-new-wrappers-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-new-wrappers')
}

console.log('Testing no-new-wrappers rule from the shipped config...')

// `new String(...)` must be flagged — produces a boxed object, not a primitive.
const newString = await noNewWrappersMessages(
  "export const label = new String('hello')\n"
)
assert.ok(
  newString.length > 0,
  "Expected `new String('hello')` to be flagged by no-new-wrappers"
)
assert.strictEqual(
  newString[0].severity,
  2,
  'no-new-wrappers should be an error'
)

// `new Number(...)` must be flagged — typeof is 'object', not 'number'.
const newNumber = await noNewWrappersMessages(
  'export const count = new Number(42)\n'
)
assert.ok(
  newNumber.length > 0,
  'Expected `new Number(42)` to be flagged by no-new-wrappers'
)

// `new Boolean(...)` must be flagged — the object is always truthy.
const newBoolean = await noNewWrappersMessages(
  'export const flag = new Boolean(false)\n'
)
assert.ok(
  newBoolean.length > 0,
  'Expected `new Boolean(false)` to be flagged by no-new-wrappers'
)

// Plain conversion calls must NOT be flagged.
const stringConversion = await noNewWrappersMessages(
  'export const label = String(42)\n'
)
assert.strictEqual(
  stringConversion.length,
  0,
  'Did not expect `String(42)` to be flagged by no-new-wrappers'
)

const numberConversion = await noNewWrappersMessages(
  "export const count = Number('42')\n"
)
assert.strictEqual(
  numberConversion.length,
  0,
  "Did not expect `Number('42')` to be flagged by no-new-wrappers"
)

const booleanConversion = await noNewWrappersMessages(
  'export const flag = Boolean(0)\n'
)
assert.strictEqual(
  booleanConversion.length,
  0,
  'Did not expect `Boolean(0)` to be flagged by no-new-wrappers'
)

console.log('✅ All tests passed!')
