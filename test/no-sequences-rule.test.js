/**
 * Integration test for the `no-sequences` rule shipped by eslint-config-agent.
 *
 * The shared config must reject the comma operator — a construct that smuggles
 * several side effects into one expression and discards every result but the
 * last — while leaving the legitimate comma uses (`for` headers, call
 * arguments, array literals, declaration lists) untouched. This guards against
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

const noSequencesMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-sequences-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-sequences')
}

console.log('Testing no-sequences rule from the shipped config...')

// The comma operator in an assignment must be flagged.
const assignmentSequence = await noSequencesMessages(
  'export const run = (a, b) => {\n  const value = (a(), b())\n  return value\n}\n'
)
assert.ok(
  assignmentSequence.length > 0,
  'Expected the comma operator in an assignment to be flagged by no-sequences'
)
assert.strictEqual(
  assignmentSequence[0].severity,
  2,
  'no-sequences should be an error'
)

// The comma operator in a return statement must be flagged.
const returnSequence = await noSequencesMessages(
  'export const run = (cleanup, value) => {\n  return cleanup(), value\n}\n'
)
assert.ok(
  returnSequence.length > 0,
  'Expected the comma operator in a return to be flagged by no-sequences'
)

// Legitimate comma uses must NOT be flagged: `for` headers, call arguments,
// array literals and declaration lists all rely on commas that are not the
// comma operator.
const legitimateCommas = await noSequencesMessages(
  [
    'export const run = items => {',
    '  const pairs = [1, 2, 3]',
    '  let total = 0',
    '  for (let i = 0, len = pairs.length; i < len; i += 1, total += 1) {',
    '    total += pairs[i]',
    '  }',
    '  return Math.max(total, items.length)',
    '}',
    '',
  ].join('\n')
)
assert.strictEqual(
  legitimateCommas.length,
  0,
  'Did not expect legitimate comma uses to be flagged by no-sequences'
)

console.log('✅ All tests passed!')
