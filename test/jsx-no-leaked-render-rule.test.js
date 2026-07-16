/**
 * Integration test for the `react/jsx-no-leaked-render` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a `{value && <jsx />}` short-circuit that can
 * leak a falsy non-boolean (e.g. `0`) into the rendered output, and accept the
 * unambiguous ternary form. This guards against accidental removal of the rule
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

const leakedRenderMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'jsx-no-leaked-render-sample.jsx',
  })
  return result.messages.filter(
    message => message.ruleId === 'react/jsx-no-leaked-render'
  )
}

console.log(
  'Testing react/jsx-no-leaked-render rule from the shipped config...'
)

// A bare `&&` short-circuit on a numeric value can leak `0` and must be flagged.
const leaked = await leakedRenderMessages(
  'export const List = ({ count, items }) => {\n' +
    '  return <div>{count && <span>{items}</span>}</div>\n' +
    '}\n'
)
assert.ok(
  leaked.length > 0,
  'Expected `{count && <jsx />}` to be flagged by react/jsx-no-leaked-render'
)
assert.strictEqual(
  leaked[0].severity,
  2,
  'react/jsx-no-leaked-render should be an error'
)

// The explicit ternary form is unambiguous and must pass.
const ternary = await leakedRenderMessages(
  'export const List = ({ count, items }) => {\n' +
    '  return <div>{count ? <span>{items}</span> : null}</div>\n' +
    '}\n'
)
assert.strictEqual(
  ternary.length,
  0,
  'Did not expect the ternary form to be flagged by react/jsx-no-leaked-render'
)

console.log('✅ All tests passed!')
