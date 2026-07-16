/**
 * Integration test for the `@typescript-eslint/no-unnecessary-condition`
 * rule shipped by eslint-config-agent.
 *
 * A condition whose type proves it is always truthy or always falsy is a
 * dead guard: it looks like a real null/undefined check but the type
 * checker has already ruled that case out, usually because a refactor
 * narrowed the type and left the check behind. The shared config must flag
 * a guard over a non-nullable type and leave a guard over a genuinely
 * nullable type alone.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noUnnecessaryConditionMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-unnecessary-condition'
  )
}

console.log('Testing no-unnecessary-condition rule from the shipped config...')

// A guard over a non-nullable type must be flagged.
const invalid = await noUnnecessaryConditionMessages(
  'test/no-unnecessary-condition/invalid-no-unnecessary-condition.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected an always-truthy guard to be flagged by no-unnecessary-condition, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-unnecessary-condition should be an error'
)

// A guard over a genuinely nullable type must not be flagged.
const valid = await noUnnecessaryConditionMessages(
  'test/no-unnecessary-condition/valid-no-unnecessary-condition.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a guard over a nullable type to be flagged by no-unnecessary-condition, got ${valid.length}`
)

console.log('✅ All tests passed!')
