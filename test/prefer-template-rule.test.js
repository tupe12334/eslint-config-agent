/**
 * Integration test for the `prefer-template` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject string concatenation with `+` and accept the
 * equivalent template literal. This guards against accidental removal of the
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

const preferTemplateMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'prefer-template-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'prefer-template')
}

console.log('Testing prefer-template rule from the shipped config...')

// String concatenation must be flagged.
const concatenation = await preferTemplateMessages(
  'export const greet = name => {\n  return "Hello " + name\n}\n'
)
assert.ok(
  concatenation.length > 0,
  'Expected `"Hello " + name` to be flagged by the prefer-template rule'
)
assert.strictEqual(
  concatenation[0].severity,
  2,
  'prefer-template should be an error'
)

// Template literals must pass.
const templateLiteral = await preferTemplateMessages(
  'export const greet = name => {\n  return `Hello ${name}`\n}\n'
)
assert.strictEqual(
  templateLiteral.length,
  0,
  'Did not expect a template literal to be flagged by the prefer-template rule'
)

console.log('✅ All tests passed!')
