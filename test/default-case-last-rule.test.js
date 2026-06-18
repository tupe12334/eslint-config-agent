/**
 * Integration test for the `default-case-last` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject a `switch` whose `default` clause is not the
 * last clause, and accept a `switch` whose `default` comes last. This guards
 * against accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const defaultCaseLastMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'default-case-last-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'default-case-last'
  )
}

console.log('Testing default-case-last rule from the shipped config...')

// A `default` clause placed before later `case`s must be flagged.
const defaultNotLast = await defaultCaseLastMessages(
  'export const label = value => {\n' +
    '  switch (value) {\n' +
    '    default:\n' +
    "      return 'other'\n" +
    '    case 1:\n' +
    "      return 'one'\n" +
    '  }\n' +
    '}\n'
)
assert.ok(
  defaultNotLast.length > 0,
  'Expected a non-last `default` clause to be flagged by default-case-last'
)
assert.strictEqual(
  defaultNotLast[0].severity,
  2,
  'default-case-last should be an error'
)

// A `switch` whose `default` clause comes last must pass.
const defaultLast = await defaultCaseLastMessages(
  'export const label = value => {\n' +
    '  switch (value) {\n' +
    '    case 1:\n' +
    "      return 'one'\n" +
    '    default:\n' +
    "      return 'other'\n" +
    '  }\n' +
    '}\n'
)
assert.strictEqual(
  defaultLast.length,
  0,
  'Did not expect a last `default` clause to be flagged by default-case-last'
)

console.log('✅ All tests passed!')
