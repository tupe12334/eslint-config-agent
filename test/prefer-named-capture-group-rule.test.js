/**
 * Integration test for the `prefer-named-capture-group` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag unnamed (positional) capture groups in regex
 * literals and require every capturing group to carry a name (`(?<name>...)`).
 * Non-capturing groups (`(?:...)`) are unaffected. This guards against
 * accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

/**
 * @param code - Source code to lint as a .js file.
 * @returns Messages for prefer-named-capture-group.
 */
const namedCaptureMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'named-capture-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'prefer-named-capture-group'
  )
}

console.log(
  'Testing prefer-named-capture-group rule from the shipped config...'
)

// An unnamed capturing group must be flagged.
const unnamed = await namedCaptureMessages(
  'export const getYear = str => str.match(/(\\d{4})/)?.[1]\n'
)
assert.ok(
  unnamed.length > 0,
  'Expected `(\\d{4})` (unnamed capture group) to be flagged by prefer-named-capture-group'
)
assert.strictEqual(
  unnamed[0].severity,
  2,
  'prefer-named-capture-group should be an error'
)

// A named capturing group must pass.
const named = await namedCaptureMessages(
  'export const getYear = str => str.match(/(?<year>\\d{4})/)?.groups?.year\n'
)
assert.strictEqual(
  named.length,
  0,
  'Did not expect `(?<year>\\d{4})` (named capture group) to be flagged'
)

// A non-capturing group must pass — only capturing groups need names.
const nonCapturing = await namedCaptureMessages(
  'export const isISO = str => /(?:\\d{4})-(?:\\d{2})-(?:\\d{2})/.test(str)\n'
)
assert.strictEqual(
  nonCapturing.length,
  0,
  'Did not expect a non-capturing group `(?:...)` to be flagged'
)

console.log('✅ All tests passed!')
