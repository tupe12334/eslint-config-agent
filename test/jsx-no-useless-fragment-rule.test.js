/**
 * Integration test for the `react/jsx-no-useless-fragment` rule shipped by
 * eslint-config-agent.
 *
 * A fragment that wraps only a single child adds DOM overhead and is almost
 * always an oversight — a leftover wrapper after removing siblings, or a
 * habit that sneaked in from a multi-child case. The shared config must flag
 * the single-child fragment while leaving the load-bearing multi-child form
 * alone. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const fragmentMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'jsx-no-useless-fragment-sample.jsx',
  })
  return result.messages.filter(
    message => message.ruleId === 'react/jsx-no-useless-fragment'
  )
}

console.log(
  'Testing react/jsx-no-useless-fragment rule from the shipped config...'
)

// A fragment wrapping a single element is useless — the fragment adds nothing
// and must be flagged.
const singleChild = await fragmentMessages(
  'export const El = () => <><span>hello</span></>\n'
)
assert.ok(
  singleChild.length > 0,
  'Expected a single-child fragment to be flagged by react/jsx-no-useless-fragment'
)
assert.strictEqual(
  singleChild[0].severity,
  2,
  'react/jsx-no-useless-fragment should be an error'
)

// A fragment wrapping multiple children is load-bearing and must pass.
const multiChild = await fragmentMessages(
  'export const El = () => <><span>a</span><span>b</span></>\n'
)
assert.strictEqual(
  multiChild.length,
  0,
  'Did not expect a multi-child fragment to be flagged by react/jsx-no-useless-fragment'
)

console.log('✅ All tests passed!')
