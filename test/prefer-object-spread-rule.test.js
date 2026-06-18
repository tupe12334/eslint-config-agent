/**
 * Integration test for the `prefer-object-spread` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag `Object.assign` with an object-literal first
 * argument (the copy/merge-into-a-new-object idiom), accept the object-spread
 * form, and leave a genuine in-place `Object.assign(target, src)` mutation
 * alone. This guards against accidental removal of the rule and documents the
 * intended behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const preferObjectSpreadMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'prefer-object-spread-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'prefer-object-spread'
  )
}

console.log('Testing prefer-object-spread rule from the shipped config...')

// `Object.assign` with an object-literal first argument must be flagged.
const objectAssignCopy = await preferObjectSpreadMessages(
  'export const merge = (base, override) =>\n  Object.assign({}, base, override)\n'
)
assert.ok(
  objectAssignCopy.length > 0,
  'Expected Object.assign({}, ...) to be flagged by prefer-object-spread'
)
assert.strictEqual(
  objectAssignCopy[0].severity,
  2,
  'prefer-object-spread should be an error'
)

// The object-spread form must pass.
const objectSpread = await preferObjectSpreadMessages(
  'export const merge = (base, override) => ({ ...base, ...override })\n'
)
assert.strictEqual(
  objectSpread.length,
  0,
  'Did not expect object spread to be flagged by prefer-object-spread'
)

// A genuine in-place mutation `Object.assign(target, src)` must pass.
const inPlaceMutation = await preferObjectSpreadMessages(
  'export const apply = (target, src) => Object.assign(target, src)\n'
)
assert.strictEqual(
  inPlaceMutation.length,
  0,
  'Did not expect Object.assign(target, src) to be flagged by prefer-object-spread'
)

console.log('✅ All tests passed!')
