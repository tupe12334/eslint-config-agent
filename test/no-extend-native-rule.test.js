/**
 * Integration test for the `no-extend-native` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject monkey-patching the prototype of a built-in
 * object (`Array.prototype.last = ...`, `Object.prototype.foo = ...`) — a
 * process-wide footgun that leaks into `for...in` loops and clashes across
 * libraries — and accept adding methods to a user-defined class. This guards
 * against accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 =
 * pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const extendNativeMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'extend-native-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-extend-native'
  )
}

console.log('Testing no-extend-native rule from the shipped config...')

// Patching Array.prototype must be flagged.
const arrayPatch = await extendNativeMessages(
  'Array.prototype.last = function () {\n  return this[this.length - 1]\n}\n'
)
assert.ok(
  arrayPatch.length > 0,
  'Expected extending Array.prototype to be flagged by the no-extend-native rule'
)
assert.strictEqual(
  arrayPatch[0].severity,
  2,
  'no-extend-native should be an error'
)

// Patching Object.prototype must be flagged.
const objectPatch = await extendNativeMessages(
  'Object.prototype.keysOf = function () {\n  return Object.keys(this)\n}\n'
)
assert.ok(
  objectPatch.length > 0,
  'Expected extending Object.prototype to be flagged by the no-extend-native rule'
)

// Adding methods to a user-defined class must pass.
const userClass = await extendNativeMessages(
  'class Box {}\nBox.prototype.size = function () {\n  return 0\n}\n'
)
assert.strictEqual(
  userClass.length,
  0,
  'Did not expect extending a user-defined class to be flagged by the no-extend-native rule'
)

console.log('✅ All tests passed!')
