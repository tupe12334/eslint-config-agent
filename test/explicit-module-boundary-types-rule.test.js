/**
 * Integration test for the `@typescript-eslint/explicit-module-boundary-types`
 * rule shipped by eslint-config-agent.
 *
 * The public surface of a module is a contract: when an exported function's
 * return/parameter types are left to inference, a refactor inside it can
 * silently change the type consumers depend on, and the break only surfaces far
 * away at a call site. The shared config must flag an exported function whose
 * boundary types are inferred while leaving a fully annotated boundary alone.
 * This guards against accidental removal of the rule and documents the intended
 * behavior.
 *
 * The fixtures are real on-disk files the TypeScript project service can
 * resolve (a synthetic `lintText` filePath gets no type information and fails to
 * parse under the type-aware config). Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const RULE = '@typescript-eslint/explicit-module-boundary-types'

const boundaryMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(message => message.ruleId === RULE)
}

console.log(
  'Testing @typescript-eslint/explicit-module-boundary-types rule from the shipped config...'
)

// An exported function with an inferred return type must be flagged.
const invalid = await boundaryMessages(
  'test/explicit-module-boundary-types/invalid-boundary.ts'
)
assert.ok(
  invalid.length > 0,
  'Expected an exported function with an inferred return type to be flagged'
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'explicit-module-boundary-types should be an error'
)

// A fully annotated boundary must pass.
const valid = await boundaryMessages(
  'test/explicit-module-boundary-types/valid-boundary.ts'
)
assert.strictEqual(
  valid.length,
  0,
  'Did not expect a fully annotated exported function to be flagged'
)

console.log('✅ All tests passed!')
