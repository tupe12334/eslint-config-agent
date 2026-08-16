/**
 * Integration test for the `@typescript-eslint/explicit-module-boundary-types`
 * rule shipped by eslint-config-agent.
 *
 * An exported function with an inferred return type is a module boundary
 * left implicit and must be flagged. An exported function with an explicit
 * return type, and an internal (non-exported) helper left inferred, must not
 * be flagged.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const explicitModuleBoundaryTypesMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message =>
      message.ruleId === '@typescript-eslint/explicit-module-boundary-types'
  )
}

console.log(
  'Testing explicit-module-boundary-types rule from the shipped config...'
)

// An exported function with an inferred return type must be flagged.
const invalid = await explicitModuleBoundaryTypesMessages(
  'test/explicit-module-boundary-types/invalid-explicit-module-boundary-types.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected an exported function with an inferred return type to be flagged, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'explicit-module-boundary-types should be an error'
)

// An exported function with an explicit return type, and a non-exported
// helper left inferred, must not be flagged.
const valid = await explicitModuleBoundaryTypesMessages(
  'test/explicit-module-boundary-types/valid-explicit-module-boundary-types.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a typed export or an internal helper to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
