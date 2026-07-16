/**
 * Integration test for the `react/jsx-no-useless-fragment` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a fragment that wraps a single child element
 * (dead-weight that adds DOM overhead and a return-type mismatch) and accept
 * fragments that genuinely wrap multiple children. Run as a standalone node
 * script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const uselessFragmentMessages = async code => {
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

// A fragment wrapping a single element must be flagged.
const singleChild = await uselessFragmentMessages(
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
const multiChild = await uselessFragmentMessages(
  'export const El = () => <><span>a</span><span>b</span></>\n'
)
assert.strictEqual(
  multiChild.length,
  0,
  'Did not expect a multi-child fragment to be flagged by react/jsx-no-useless-fragment'
)

console.log('✅ All tests passed!')
