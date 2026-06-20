/**
 * Integration test for the `no-object-constructor` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject the `Object` constructor (`new Object()` and
 * `Object()`) and accept the `{}` object literal. This guards against
 * accidental removal of the rule and documents the intended behavior. Run as a
 * standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noObjectConstructorMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-object-constructor-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-object-constructor'
  )
}

console.log('Testing no-object-constructor rule from the shipped config...')

// `new Object()` must be flagged.
const newObject = await noObjectConstructorMessages(
  'export const make = () => {\n' + '  return new Object()\n' + '}\n'
)
assert.ok(
  newObject.length > 0,
  'Expected `new Object()` to be flagged by no-object-constructor'
)
assert.strictEqual(
  newObject[0].severity,
  2,
  'no-object-constructor should be an error'
)

// A bare `Object()` call must also be flagged.
const callObject = await noObjectConstructorMessages(
  'export const make = () => {\n' + '  return Object()\n' + '}\n'
)
assert.ok(
  callObject.length > 0,
  'Expected `Object()` to be flagged by no-object-constructor'
)

// The `{}` object literal must pass.
const literal = await noObjectConstructorMessages(
  'export const make = () => {\n' + '  return {}\n' + '}\n'
)
assert.strictEqual(
  literal.length,
  0,
  'Did not expect the `{}` object literal to be flagged by no-object-constructor'
)

console.log('✅ All tests passed!')
