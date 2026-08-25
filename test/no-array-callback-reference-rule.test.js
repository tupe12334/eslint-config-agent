/**
 * Integration test for unicorn/no-array-callback-reference.
 *
 * Passing a function reference directly to an array callback can hide the
 * callback's input shape and makes it easy to accidentally pass the wrong
 * function. The shared config requires an explicit callback instead.
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const ruleMessages = async source => {
  const [result] = await eslint.lintText(source, {
    filePath: 'no-array-callback-reference-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'unicorn/no-array-callback-reference'
  )
}

const directReference = await ruleMessages(
  'const toLabel = item => item.label\n' +
    'export const labels = items.map(toLabel)\n'
)
assert.ok(
  directReference.length > 0,
  'Expected a direct array callback reference to be flagged'
)
assert.strictEqual(
  directReference[0].severity,
  2,
  'unicorn/no-array-callback-reference should be an error'
)

const explicitCallback = await ruleMessages(
  'const toLabel = item => item.label\n' +
    'export const labels = items.map(item => toLabel(item))\n'
)
assert.strictEqual(
  explicitCallback.length,
  0,
  'Did not expect an explicit array callback to be flagged'
)

console.log('✅ no-array-callback-reference tests passed!')
