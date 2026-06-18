/**
 * Integration test for the `yoda` rule shipped by eslint-config-agent.
 *
 * The shared config must reject "yoda" conditions (literal on the left, e.g.
 * `0 === count`) and accept the natural ordering (`count === 0`). The
 * `exceptRange: true` option must still allow the range idiom
 * (`0 <= x && x < limit`). This guards against accidental removal of the rule
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

const yodaMessages = async code => {
  const [result] = await eslint.lintText(code, { filePath: 'yoda-sample.js' })
  return result.messages.filter(message => message.ruleId === 'yoda')
}

console.log('Testing yoda rule from the shipped config...')

// Literal on the left must be flagged.
const literalLeft = await yodaMessages(
  'export const isZero = count => {\n  return 0 === count\n}\n'
)
assert.ok(
  literalLeft.length > 0,
  'Expected `0 === count` to be flagged by the yoda rule'
)
assert.strictEqual(literalLeft[0].severity, 2, 'yoda should be an error')

const stringLiteralLeft = await yodaMessages(
  "export const isDone = status => {\n  return 'done' === status\n}\n"
)
assert.ok(
  stringLiteralLeft.length > 0,
  "Expected `'done' === status` to be flagged by the yoda rule"
)

// Natural ordering must pass.
const naturalOrder = await yodaMessages(
  'export const isZero = count => {\n  return count === 0\n}\n'
)
assert.strictEqual(
  naturalOrder.length,
  0,
  'Did not expect `count === 0` to be flagged by the yoda rule'
)

// The range idiom is allowed by `exceptRange: true` (range used as a
// condition, the form the option recognizes as a number-line check).
const rangeIdiom = await yodaMessages(
  'export const inRange = (x, limit) => {\n  if (0 <= x && x < limit) {\n    return true\n  }\n  return false\n}\n'
)
assert.strictEqual(
  rangeIdiom.length,
  0,
  'Did not expect the `0 <= x && x < limit` range idiom to be flagged'
)

console.log('✅ All tests passed!')
