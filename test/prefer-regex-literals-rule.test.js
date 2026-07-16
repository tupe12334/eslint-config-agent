/**
 * Integration test for the `prefer-regex-literals` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject the `RegExp` constructor when the pattern is a
 * static string (the double-escaping footgun) and the redundant wrapping of an
 * existing regex literal (`new RegExp(/foo/)`), while leaving a genuinely
 * dynamic `new RegExp(variable)` and a plain regex literal alone. This guards
 * against accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 =
 * pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const regexLiteralMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'regex-literal-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'prefer-regex-literals'
  )
}

console.log('Testing prefer-regex-literals rule from the shipped config...')

// A `RegExp` constructor with a static string pattern must be flagged.
const stringPattern = await regexLiteralMessages(
  "export const digits = new RegExp('\\\\d+')\n"
)
assert.ok(
  stringPattern.length > 0,
  'Expected new RegExp("\\\\d+") to be flagged by prefer-regex-literals'
)
assert.strictEqual(
  stringPattern[0].severity,
  2,
  'prefer-regex-literals should be an error'
)

// Redundantly wrapping a regex literal must be flagged (disallowRedundantWrapping).
const redundantWrap = await regexLiteralMessages(
  'export const wrapped = new RegExp(/abc/)\n'
)
assert.ok(
  redundantWrap.length > 0,
  'Expected new RegExp(/abc/) to be flagged by prefer-regex-literals (redundant wrapping)'
)

// A plain regex literal must pass.
const literal = await regexLiteralMessages('export const ok = /\\d+/\n')
assert.strictEqual(
  literal.length,
  0,
  'Did not expect a plain regex literal to be flagged by prefer-regex-literals'
)

// A genuinely dynamic pattern (constructed from a variable) must pass.
const dynamic = await regexLiteralMessages(
  'export const make = pattern => new RegExp(pattern)\n'
)
assert.strictEqual(
  dynamic.length,
  0,
  'Did not expect new RegExp(variable) to be flagged by prefer-regex-literals'
)

console.log('✅ All tests passed!')
