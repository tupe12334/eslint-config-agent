/**
 * Integration test for the `no-template-curly-in-string` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a regular (single/double-quoted) string that
 * contains `${...}` — the author almost always meant a template literal, so the
 * placeholder is emitted verbatim instead of being interpolated. A genuine
 * template literal must pass. This guards the rule against accidental removal
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

const messagesFor = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-template-curly-in-string-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-template-curly-in-string'
  )
}

console.log(
  'Testing no-template-curly-in-string rule from the shipped config...'
)

// A placeholder inside a plain string must be flagged.
const plainString = await messagesFor(
  'export const greet = (name) => "Hello, ${name}"\n'
)
assert.ok(
  plainString.length > 0,
  'Expected `${...}` inside a regular string to be flagged'
)
assert.strictEqual(
  plainString[0].severity,
  2,
  'no-template-curly-in-string should be an error'
)

// A genuine template literal must pass.
const templateLiteral = await messagesFor(
  'export const greet = (name) => `Hello, ${name}`\n'
)
assert.strictEqual(
  templateLiteral.length,
  0,
  'Did not expect a real template literal to be flagged'
)

console.log('✅ All tests passed!')
