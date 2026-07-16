/**
 * Integration test for the `prefer-object-has-own` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject the verbose, prototype-plumbing form
 * `Object.prototype.hasOwnProperty.call(obj, key)` and accept the explicit,
 * prototype-safe `Object.hasOwn(obj, key)`. This guards against accidental
 * removal of the rule and documents the intended behavior. Run as a standalone
 * node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const preferHasOwnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'prefer-object-has-own-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'prefer-object-has-own'
  )
}

console.log('Testing prefer-object-has-own rule from the shipped config...')

// `Object.prototype.hasOwnProperty.call(...)` must be flagged.
const protoCall = await preferHasOwnMessages(
  'export const has = (obj, key) => {\n  return Object.prototype.hasOwnProperty.call(obj, key)\n}\n'
)
assert.ok(
  protoCall.length > 0,
  'Expected `Object.prototype.hasOwnProperty.call(...)` to be flagged by prefer-object-has-own'
)
assert.strictEqual(
  protoCall[0].severity,
  2,
  'prefer-object-has-own should be an error'
)

// The shorthand `Object.hasOwnProperty.call(...)` must be flagged too.
const shorthandCall = await preferHasOwnMessages(
  'export const has = (obj, key) => {\n  return Object.hasOwnProperty.call(obj, key)\n}\n'
)
assert.ok(
  shorthandCall.length > 0,
  'Expected `Object.hasOwnProperty.call(...)` to be flagged by prefer-object-has-own'
)

// `Object.hasOwn(...)` is the intended form and must pass.
const hasOwn = await preferHasOwnMessages(
  'export const has = (obj, key) => {\n  return Object.hasOwn(obj, key)\n}\n'
)
assert.strictEqual(
  hasOwn.length,
  0,
  'Did not expect `Object.hasOwn(...)` to be flagged by prefer-object-has-own'
)

console.log('✅ All tests passed!')
