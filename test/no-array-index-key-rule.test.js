/**
 * Integration test for the `react/no-array-index-key` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a list child keyed by its array index
 * (`items.map((item, i) => <li key={i} />)`), which makes React reuse the wrong
 * element across reorders/inserts/removals, and must accept a key derived from a
 * stable, item-specific value. This guards against accidental removal of the
 * rule and documents the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const indexKeyMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-array-index-key-sample.jsx',
  })
  return result.messages.filter(
    message => message.ruleId === 'react/no-array-index-key'
  )
}

console.log('Testing react/no-array-index-key rule from the shipped config...')

// Keying a list child by its array index must be flagged.
const indexed = await indexKeyMessages(
  'export const List = ({ items }) => {\n' +
    '  return <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>\n' +
    '}\n'
)
assert.ok(
  indexed.length > 0,
  'Expected `key={i}` to be flagged by react/no-array-index-key'
)
assert.strictEqual(
  indexed[0].severity,
  2,
  'react/no-array-index-key should be an error'
)

// A key derived from a stable, item-specific value must pass.
const stable = await indexKeyMessages(
  'export const List = ({ items }) => {\n' +
    '  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>\n' +
    '}\n'
)
assert.strictEqual(
  stable.length,
  0,
  'Did not expect a stable item key to be flagged by react/no-array-index-key'
)

console.log('✅ All tests passed!')
