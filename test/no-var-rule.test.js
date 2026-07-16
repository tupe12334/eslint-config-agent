/**
 * Integration test for the `no-var` rule shipped by eslint-config-agent.
 *
 * The shared config must flag a `var` declaration and accept the block-scoped
 * `let`/`const` alternatives. This guards against accidental removal of the
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

const noVarMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-var-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-var')
}

console.log('Testing no-var rule from the shipped config...')

// A `var` declaration must be flagged.
const varDeclaration = await noVarMessages(
  'export const run = () => {\n  var value = 1\n  return value\n}\n'
)
assert.ok(
  varDeclaration.length > 0,
  'Expected a `var` declaration to be flagged by no-var'
)
assert.strictEqual(varDeclaration[0].severity, 2, 'no-var should be an error')

// A `const` binding must pass.
const constBinding = await noVarMessages(
  'export const run = () => {\n  const value = 1\n  return value\n}\n'
)
assert.strictEqual(
  constBinding.length,
  0,
  'Did not expect a `const` binding to be flagged by no-var'
)

// A `let` binding must pass.
const letBinding = await noVarMessages(
  'export const run = () => {\n  let value = 1\n  value = 2\n  return value\n}\n'
)
assert.strictEqual(
  letBinding.length,
  0,
  'Did not expect a `let` binding to be flagged by no-var'
)

console.log('✅ All tests passed!')
