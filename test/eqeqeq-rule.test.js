/**
 * Integration test for the `eqeqeq` rule shipped by eslint-config-agent.
 *
 * The shared config must reject loose equality (`==` / `!=`) and accept strict
 * equality (`===` / `!==`). This guards against accidental removal of the rule
 * and documents the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const eqeqeqMessages = async code => {
  const [result] = await eslint.lintText(code, { filePath: 'eqeqeq-sample.js' })
  return result.messages.filter(message => message.ruleId === 'eqeqeq')
}

console.log('Testing eqeqeq rule from the shipped config...')

// Loose equality must be flagged.
const looseEqual = await eqeqeqMessages(
  'export const isSame = (a, b) => {\n  return a == b\n}\n'
)
assert.ok(
  looseEqual.length > 0,
  'Expected `==` to be flagged by the eqeqeq rule'
)
assert.strictEqual(looseEqual[0].severity, 2, 'eqeqeq should be an error')

const looseNotEqual = await eqeqeqMessages(
  'export const isDifferent = (a, b) => {\n  return a != b\n}\n'
)
assert.ok(
  looseNotEqual.length > 0,
  'Expected `!=` to be flagged by the eqeqeq rule'
)

// Strict equality must pass.
const strictEqual = await eqeqeqMessages(
  'export const isSame = (a, b) => {\n  return a === b\n}\n'
)
assert.strictEqual(
  strictEqual.length,
  0,
  'Did not expect `===` to be flagged by the eqeqeq rule'
)

const strictNotEqual = await eqeqeqMessages(
  'export const isDifferent = (a, b) => {\n  return a !== b\n}\n'
)
assert.strictEqual(
  strictNotEqual.length,
  0,
  'Did not expect `!==` to be flagged by the eqeqeq rule'
)

console.log('✅ All tests passed!')
