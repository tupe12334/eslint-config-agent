/**
 * Integration test for the `prefer-object-spread` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject building a new object with
 * `Object.assign({}, ...)` in favor of object spread (`{ ...a, ...b }`), while
 * leaving `Object.assign(target, ...)` onto an existing target (which mutates)
 * untouched. This guards against accidental removal of the rule and documents
 * the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
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

// `Object.assign({}, source)` builds a new object and must be flagged.
const newObject = await preferObjectSpreadMessages(
  'export const merge = source => {\n' +
    '  return Object.assign({}, source)\n' +
    '}\n'
)
assert.ok(
  newObject.length > 0,
  'Expected `Object.assign({}, source)` to be flagged by prefer-object-spread'
)
assert.strictEqual(
  newObject[0].severity,
  2,
  'prefer-object-spread should be an error'
)

// Merging several sources into a fresh object must also be flagged.
const newObjectMulti = await preferObjectSpreadMessages(
  'export const merge = (a, b) => {\n' +
    '  return Object.assign({}, a, b)\n' +
    '}\n'
)
assert.ok(
  newObjectMulti.length > 0,
  'Expected `Object.assign({}, a, b)` to be flagged by prefer-object-spread'
)

// The explicit object-spread form must pass.
const spread = await preferObjectSpreadMessages(
  'export const merge = (a, b) => {\n' + '  return { ...a, ...b }\n' + '}\n'
)
assert.strictEqual(
  spread.length,
  0,
  'Did not expect the object-spread form to be flagged by prefer-object-spread'
)

// Assigning onto an existing target mutates it and must NOT be flagged.
const mutateTarget = await preferObjectSpreadMessages(
  'export const apply = (target, source) => {\n' +
    '  return Object.assign(target, source)\n' +
    '}\n'
)
assert.strictEqual(
  mutateTarget.length,
  0,
  'Did not expect `Object.assign(target, source)` to be flagged by prefer-object-spread'
)

console.log('✅ All tests passed!')
