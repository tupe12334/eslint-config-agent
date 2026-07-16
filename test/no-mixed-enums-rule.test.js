/**
 * Integration test for the `@typescript-eslint/no-mixed-enums` rule shipped
 * by eslint-config-agent.
 *
 * TypeScript allows an enum to mix numeric and string member values, but the
 * result widens in surprising ways: string members have no reverse-mapping,
 * `Object.values()` returns a heterogeneous array, and exhaustiveness checks
 * vary across TypeScript versions. The shared config must flag every mixed
 * enum and leave pure-string and pure-numeric enums alone.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noMixedEnumsMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-mixed-enums'
  )
}

console.log('Testing no-mixed-enums rule from the shipped config...')

// An enum that mixes numeric and string members must be flagged.
const invalid = await noMixedEnumsMessages(
  'test/no-mixed-enums/invalid-mixed-enum.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected a mixed enum to be flagged by no-mixed-enums, got ${invalid.length}`
)
assert.strictEqual(invalid[0].severity, 2, 'no-mixed-enums should be an error')

// Pure-string and pure-numeric enums must not be flagged.
const valid = await noMixedEnumsMessages(
  'test/no-mixed-enums/valid-mixed-enum.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect pure-type enums to be flagged by no-mixed-enums, got ${valid.length}`
)

console.log('✅ All tests passed!')
