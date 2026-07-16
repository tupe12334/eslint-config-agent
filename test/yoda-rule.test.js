/**
 * Integration test for the `yoda` rule shipped by eslint-config-agent.
 *
 * The shared config must flag "Yoda" conditions where a literal appears on the
 * left side of a comparison (`0 === count`), and accept the natural reading
 * order (`count === 0`). The `exceptRange` option keeps the clearer number-line
 * form (`0 <= x && x < limit`) unflagged. This guards against accidental
 * removal of the rule and documents the intended behavior. Run as a standalone
 * node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const yodaMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'yoda-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'yoda')
}

console.log('Testing yoda rule from the shipped config...')

// A literal on the left side of a strict equality must be flagged.
const yodaCondition = await yodaMessages(
  'export const isDone = status => {\n' +
    "  if ('done' === status) return true\n" +
    '  return false\n' +
    '}\n'
)
assert.ok(
  yodaCondition.length > 0,
  "Expected `'done' === status` to be flagged by the yoda rule"
)
assert.strictEqual(yodaCondition[0].severity, 2, 'yoda should be an error')

// Natural reading order (variable on the left) must pass.
const naturalOrder = await yodaMessages(
  'export const isDone = status => {\n' +
    "  if (status === 'done') return true\n" +
    '  return false\n' +
    '}\n'
)
assert.strictEqual(
  naturalOrder.length,
  0,
  'Did not expect natural-order comparison to be flagged by the yoda rule'
)

// The range idiom inside an `if` condition (`0 <= x && x < 100`) is exempted
// by `exceptRange` and must pass — it reads as a number-line check and is
// clearer in this form. The exemption only applies in conditional contexts
// (if/while/ternary), not standalone expressions.
const rangeCheck = await yodaMessages(
  'export const inBounds = (x) => {\n' +
    '  if (0 <= x && x < 100) return true\n' +
    '  return false\n' +
    '}\n'
)
assert.strictEqual(
  rangeCheck.length,
  0,
  'Did not expect the range idiom in an if condition to be flagged (exceptRange)'
)

console.log('✅ All tests passed!')
