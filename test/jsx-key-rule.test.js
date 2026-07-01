/**
 * Integration test for the `react/jsx-key` rule shipped by eslint-config-agent.
 *
 * The shared config must flag elements created inside `.map()`/iterators that
 * are missing a `key` prop — React relies on `key` to track each child's
 * identity across renders, and a missing key causes it to fall back to
 * positional matching, silently corrupting state when the list is reordered
 * or filtered. The config must accept elements that do provide a stable key.
 * This test guards against accidental removal of the rule and documents the
 * intended behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const jsxKeyMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'jsx-key-sample.jsx',
  })
  return result.messages.filter(message => message.ruleId === 'react/jsx-key')
}

console.log('Testing react/jsx-key rule from the shipped config...')

// An element rendered inside .map() without a key must be flagged.
const missingKey = await jsxKeyMessages(
  "import React from 'react'\n" +
    'export const List = ({ items }) => {\n' +
    '  return <ul>{items.map(item => <li>{item.label}</li>)}</ul>\n' +
    '}\n'
)
assert.ok(
  missingKey.length > 0,
  'Expected an element missing a key inside .map() to be flagged by react/jsx-key'
)
assert.strictEqual(
  missingKey[0].severity,
  2,
  'react/jsx-key should be an error'
)

// An element rendered inside .map() with a stable key must not be flagged.
const withKey = await jsxKeyMessages(
  "import React from 'react'\n" +
    'export const List = ({ items }) => {\n' +
    '  return <ul>{items.map(item => <li key={item.id}>{item.label}</li>)}</ul>\n' +
    '}\n'
)
assert.strictEqual(
  withKey.length,
  0,
  'Did not expect an element with a stable key to be flagged by react/jsx-key'
)

console.log('✅ All tests passed!')
