/**
 * Integration test for the `no-extend-native` rule shipped by eslint-config-agent.
 *
 * The shared config must reject monkey-patching the prototype of a built-in
 * object — `Array.prototype.last = ...`, `Object.prototype.keysOf = ...` — since
 * the patch mutates global state every module and dependency shares, is
 * order-dependent, and an enumerable addition to `Object.prototype` /
 * `Array.prototype` leaks into every `for...in` loop and `in` check in the
 * program. Extending a user-defined class must still pass. This guards against
 * accidental removal of the rule and documents the intended behavior. Run as a
 * standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
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

// Patching `Array.prototype` must be flagged.
const arrayPatch = await extendNativeMessages(
  `Array.prototype.last = function () {
  return this[this.length - 1]
}
`
)
assert.ok(
  arrayPatch.length > 0,
  'Expected Array.prototype monkey-patching to be flagged'
)
assert.strictEqual(
  arrayPatch[0].severity,
  2,
  'no-extend-native should be an error'
)

// Patching `Object.prototype` must be flagged too.
const objectPatch = await extendNativeMessages(
  `Object.prototype.keysOf = function () {
  return Object.keys(this)
}
`
)
assert.ok(
  objectPatch.length > 0,
  'Expected Object.prototype monkey-patching to be flagged'
)

// Extending a user-defined class is unaffected — only built-in globals are
// flagged.
const userClassExtension = await extendNativeMessages(
  `class Base {
  greet() {
    return 'hi'
  }
}

export class Sub extends Base {
  shout() {
    return this.greet().toUpperCase()
  }
}
`
)
assert.strictEqual(
  userClassExtension.length,
  0,
  'Did not expect extending a user-defined class to be flagged'
)

console.log('no-extend-native rule test passed.')
