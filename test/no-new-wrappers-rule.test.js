/**
 * Integration test for the `no-new-wrappers` rule shipped by
 * eslint-config-agent.
 *
 * `new String(...)`, `new Number(...)`, and `new Boolean(...)` create objects,
 * not primitives: `typeof new String('x')` is `'object'`, not `'string'`, and
 * `new String('x') !== 'x'` — so every `===` comparison, `typeof` check, or
 * `instanceof` test silently produces the wrong answer. The shared config must
 * flag each wrapper constructor while letting the coercion functions
 * (`String(x)`, `Number(x)`, `Boolean(x)`) and bare literals pass. This
 * guards against accidental removal of the rule and documents the intended
 * behavior. Run as a standalone node script by scripts/test-runner.js (exit
 * code 0 = pass).
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

// new String(...) must be flagged — creates an object, not a primitive.
const newString = await noNewWrappersMessages(
  `export const greeting = new String('hello')\n`
)
assert.ok(newString.length > 0, 'Expected `new String()` to be flagged')
assert.strictEqual(
  newString[0].severity,
  2,
  'no-new-wrappers should be an error'
)

// new Number(...) must be flagged.
const newNumber = await noNewWrappersMessages(
  `export const count = new Number(42)\n`
)
assert.ok(newNumber.length > 0, 'Expected `new Number()` to be flagged')

// new Boolean(...) must be flagged.
const newBoolean = await noNewWrappersMessages(
  `export const flag = new Boolean(true)\n`
)
assert.ok(newBoolean.length > 0, 'Expected `new Boolean()` to be flagged')

// Coercion functions without `new` must pass — they return a primitive, not an object.
const coercionFunctions = await noNewWrappersMessages(
  `export const s = String(42)\nexport const n = Number('3')\nexport const b = Boolean(0)\n`
)
assert.strictEqual(
  coercionFunctions.length,
  0,
  'Did not expect coercion functions (no `new`) to be flagged'
)

// Bare literals must pass.
const literals = await noNewWrappersMessages(
  `export const s = 'hello'\nexport const n = 42\nexport const b = true\n`
)
assert.strictEqual(
  literals.length,
  0,
  'Did not expect bare literals to be flagged'
)

console.log('✅ All tests passed!')
