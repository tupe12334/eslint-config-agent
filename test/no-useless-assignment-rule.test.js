/**
 * Integration test for the `no-useless-assignment` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a "dead store" — a value assigned to a variable
 * that is overwritten before it is ever read — and must leave an assignment
 * whose value is actually used alone. This guards against accidental removal of
 * the rule and documents the intended behavior. Run as a standalone node
 * script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noUselessAssignmentMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-useless-assignment-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-useless-assignment'
  )
}

console.log('Testing no-useless-assignment rule from the shipped config...')

// `total` is assigned a computed value that is never read before being
// overwritten — a dead store that must be flagged.
const deadStore = await noUselessAssignmentMessages(
  'export const run = () => {\n' +
    '  let total = expensiveCompute()\n' +
    '  total = 0\n' +
    '  return total\n' +
    '}\n'
)
assert.ok(
  deadStore.length > 0,
  'Expected a dead-store assignment to be flagged by no-useless-assignment'
)
assert.strictEqual(
  deadStore[0].severity,
  2,
  'no-useless-assignment should be an error'
)

// A value that is assigned and then actually read must NOT be flagged.
const usedAssignment = await noUselessAssignmentMessages(
  'export const run = () => {\n' +
    '  let total = expensiveCompute()\n' +
    '  total = total + 1\n' +
    '  return total\n' +
    '}\n'
)
assert.strictEqual(
  usedAssignment.length,
  0,
  'Did not expect a used assignment to be flagged by no-useless-assignment'
)

console.log('✅ All tests passed!')
