/**
 * Integration test for the `react/no-danger` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag any use of `dangerouslySetInnerHTML` in JSX and
 * accept a component that renders content through normal React children. This
 * guards against accidental removal of the rule and documents the intended
 * behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noDangerMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'react-no-danger-sample.jsx',
  })
  return result.messages.filter(message => message.ruleId === 'react/no-danger')
}

console.log('Testing react/no-danger rule from the shipped config...')

// dangerouslySetInnerHTML must be flagged — it bypasses React's XSS defenses.
const dangerous = await noDangerMessages(
  'export const RichText = ({ html }) => (\n' +
    '  <div dangerouslySetInnerHTML={{ __html: html }} />\n' +
    ')\n'
)
assert.ok(
  dangerous.length > 0,
  'Expected `dangerouslySetInnerHTML` to be flagged by react/no-danger'
)
assert.strictEqual(
  dangerous[0].severity,
  2,
  'react/no-danger should be an error'
)

// Rendering via normal React children is safe and must not be flagged.
const safe = await noDangerMessages(
  'export const RichText = ({ children }) => <div>{children}</div>\n'
)
assert.strictEqual(
  safe.length,
  0,
  'Did not expect normal children rendering to be flagged by react/no-danger'
)

console.log('✅ All tests passed!')
