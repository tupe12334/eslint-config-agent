/**
 * Integration test for the `object-shorthand` rule shipped by
 * eslint-config-agent.
 *
 * Longhand object properties (`{ value: value }`) and longhand methods
 * (`{ run: function () {} }`) carry no meaning the shorthand forms lack — they
 * are pure boilerplate an AI assistant routinely emits, and the duplicated
 * `name: name` is a common copy-paste typo site. The shared config must reject
 * both longhand forms while accepting an already-shorthand literal and a
 * property whose key and value genuinely differ. This guards against accidental
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

const objectShorthandMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'object-shorthand-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'object-shorthand'
  )
}

console.log('Testing object-shorthand rule from the shipped config...')

// A property written as `{ value: value }` must be flagged.
const longhandProperty = await objectShorthandMessages(
  'export const wrap = (value) => {\n' + '  return { value: value }\n' + '}\n'
)
assert.ok(
  longhandProperty.length > 0,
  'Expected `{ value: value }` to be flagged by the object-shorthand rule'
)
assert.strictEqual(
  longhandProperty[0].severity,
  2,
  'object-shorthand should be an error'
)

// A longhand method definition must be flagged.
const longhandMethod = await objectShorthandMessages(
  'export const makeHandler = () => {\n' +
    '  return { run: function () {} }\n' +
    '}\n'
)
assert.ok(
  longhandMethod.length > 0,
  'Expected `{ run: function () {} }` to be flagged by the object-shorthand rule'
)

// An already-shorthand literal must pass.
const shorthand = await objectShorthandMessages(
  'export const wrap = (value) => {\n' + '  return { value }\n' + '}\n'
)
assert.strictEqual(
  shorthand.length,
  0,
  'Did not expect a shorthand literal to be flagged by the object-shorthand rule'
)

// A property whose key and value genuinely differ must pass.
const distinctKey = await objectShorthandMessages(
  'export const wrap = (value) => {\n' + '  return { result: value }\n' + '}\n'
)
assert.strictEqual(
  distinctKey.length,
  0,
  'Did not expect a property with a distinct key to be flagged by the object-shorthand rule'
)

console.log('✅ All tests passed!')
