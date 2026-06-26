/**
 * Integration test for the `no-sequences` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject the comma operator in expression-statement and
 * assignment positions where it is not parenthesized — e.g. `a++, b++` as a
 * standalone statement. The rule uses the default `allowInParentheses: true`
 * option, which exempts the parenthesised `(a, b)` form used in `for` loop
 * headers, since that context is intentional and widely understood. Commas
 * inside function arguments and array literals are structural and must also
 * pass. Run as a standalone node script by scripts/test-runner.js (exit code
 * 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const sequenceMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-sequences-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-sequences')
}

console.log('Testing no-sequences rule from the shipped config...')

// An unparenthesized comma operator used as a statement must be flagged.
const commaStatement = await sequenceMessages(
  'export const run = (counter) => {\n  counter++, counter++\n  return counter\n}\n'
)
assert.ok(
  commaStatement.length > 0,
  'Expected `a++, b++` (comma operator as statement) to be flagged by no-sequences'
)
assert.strictEqual(
  commaStatement[0].severity,
  2,
  'no-sequences should be an error'
)

// A comma inside function arguments must NOT be flagged.
const functionArguments = await sequenceMessages(
  'export const run = () => Math.max(1, 2, 3)\n'
)
assert.strictEqual(
  functionArguments.length,
  0,
  'Did not expect commas in function arguments to be flagged by no-sequences'
)

// A comma inside an array literal must NOT be flagged.
const arrayLiteral = await sequenceMessages('export const items = [1, 2, 3]\n')
assert.strictEqual(
  arrayLiteral.length,
  0,
  'Did not expect commas in array literals to be flagged by no-sequences'
)

// Separate statements must NOT be flagged.
const separateStatements = await sequenceMessages(
  'export const run = () => {\n  let counter = 0\n  counter++\n  return counter\n}\n'
)
assert.strictEqual(
  separateStatements.length,
  0,
  'Did not expect separate statements to be flagged by no-sequences'
)

console.log('✅ All tests passed!')
