/**
 * Integration test for the `no-undef-init` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject a variable explicitly initialized to
 * `undefined` (`let value = undefined`), since a declared-but-unassigned
 * binding is already `undefined` and the initializer is a no-op. A plain
 * declaration with no initializer, and one initialized to a real value, must
 * both pass. This guards against accidental removal of the rule and
 * documents the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const undefInitMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'undef-init-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-undef-init')
}

console.log('Testing no-undef-init rule from the shipped config...')

// `let value = undefined` must be flagged.
const letUndefined = await undefInitMessages(
  'export const build = () => {\n  let value = undefined\n  return value\n}\n'
)
assert.ok(
  letUndefined.length > 0,
  'Expected `let value = undefined` to be flagged by the no-undef-init rule'
)
assert.strictEqual(
  letUndefined[0].severity,
  2,
  'no-undef-init should be an error'
)

// `var value = undefined` must also be flagged.
const variableUndefined = await undefInitMessages(
  'export const build = () => {\n  var value = undefined\n  return value\n}\n'
)
assert.ok(
  variableUndefined.length > 0,
  'Expected `var value = undefined` to be flagged by the no-undef-init rule'
)

// A plain declaration with no initializer must pass.
const plainDeclaration = await undefInitMessages(
  'export const build = () => {\n  let value\n  value = 1\n  return value\n}\n'
)
assert.strictEqual(
  plainDeclaration.length,
  0,
  'Did not expect `let value` with no initializer to be flagged'
)

// Initializing to a real value must pass.
const realValue = await undefInitMessages(
  'export const build = () => {\n  const value = 1\n  return value\n}\n'
)
assert.strictEqual(
  realValue.length,
  0,
  'Did not expect `const value = 1` to be flagged by the no-undef-init rule'
)

console.log('✅ All tests passed!')
