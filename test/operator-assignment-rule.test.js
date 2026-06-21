/**
 * Integration test for the `operator-assignment` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must require the compound-assignment shorthand: a
 * self-update written longhand (`x = x + 1`) has to be flagged so it collapses
 * to `x += 1`, while an assignment that already uses the shorthand — or that is
 * not a self-update at all — must pass. This guards against accidental removal
 * of the rule and documents the intended behavior. Run as a standalone node
 * script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const operatorAssignmentMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'operator-assignment-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'operator-assignment'
  )
}

console.log('Testing operator-assignment rule from the shipped config...')

// A longhand self-update must be flagged.
const longhand = await operatorAssignmentMessages(
  'export const bump = state => {\n  let total = state.total\n  total = total + 1\n  return total\n}\n'
)
assert.ok(
  longhand.length > 0,
  'Expected `total = total + 1` to be flagged by the operator-assignment rule'
)
assert.strictEqual(
  longhand[0].severity,
  2,
  'operator-assignment should be an error'
)

// The compound-assignment shorthand must pass.
const shorthand = await operatorAssignmentMessages(
  'export const bump = state => {\n  let total = state.total\n  total += 1\n  return total\n}\n'
)
assert.strictEqual(
  shorthand.length,
  0,
  'Did not expect `total += 1` to be flagged by the operator-assignment rule'
)

// An assignment that is not a self-update must pass.
const notSelfUpdate = await operatorAssignmentMessages(
  'export const sum = (a, b) => {\n  let result = a\n  result = b + 1\n  return result\n}\n'
)
assert.strictEqual(
  notSelfUpdate.length,
  0,
  'Did not expect a non-self-update assignment to be flagged by the operator-assignment rule'
)

console.log('✅ All tests passed!')
