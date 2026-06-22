/**
 * Integration test for the `no-extra-bind` rule shipped by eslint-config-agent.
 *
 * The shared config must reject `.bind()` on a function that never references
 * `this` (and binds no arguments) — the call allocates a new wrapper and returns
 * one that behaves identically to the original, so it is pure dead overhead that
 * misleads the reader, the same "looks meaningful but is dead" clutter the
 * `no-useless-return` / `no-useless-concat` rules already target. A `.bind()` on
 * a function that does use `this` must pass. This guards against accidental
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

const extraBindMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'extra-bind-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-extra-bind')
}

console.log('Testing no-extra-bind rule from the shipped config...')

// `.bind(this)` on a body that never reads `this` must be flagged.
const deadBind = await extraBindMessages(
  'export const f = function () {\n  return 1\n}.bind(this)\n'
)
assert.ok(
  deadBind.length > 0,
  'Expected a `.bind()` on a function that ignores `this` to be flagged'
)
assert.strictEqual(deadBind[0].severity, 2, 'no-extra-bind should be an error')

// `.bind()` on a function that genuinely uses `this` must pass.
const realBind = await extraBindMessages(
  'export const f = function () {\n  return this.value\n}.bind(target)\n'
)
assert.strictEqual(
  realBind.length,
  0,
  'Did not expect a `.bind()` on a function that uses `this` to be flagged'
)

console.log('no-extra-bind rule test passed.')
