/**
 * Integration test for the `@typescript-eslint/no-misused-promises` rule
 * shipped by eslint-config-agent.
 *
 * Passing an async callback where the expected return type is `void` silently
 * discards the returned Promise — rejections become unhandled and any work
 * inside the callback is still in flight when the outer call returns. The
 * classic case is `array.forEach(async item => { ... })`: TypeScript accepts
 * it, no runtime error is thrown immediately, but promises are dropped. The
 * shared config must flag the async-forEach pattern while leaving an explicit
 * `for...of` loop with `await` alone. This guards against accidental removal
 * of the rule and documents the intended behavior.
 *
 * The rule is type-aware, so the fixtures must be real on-disk files the
 * TypeScript project service can resolve. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noMisusedPromisesMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-misused-promises'
  )
}

console.log('Testing no-misused-promises rule from the shipped config...')

// An async callback passed to forEach where void return is expected must be
// flagged.
const invalid = await noMisusedPromisesMessages(
  'test/no-misused-promises/invalid-no-misused-promises.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected the async-forEach pattern to be flagged by no-misused-promises, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-misused-promises should be an error'
)

// An explicit for...of loop with await must pass.
const valid = await noMisusedPromisesMessages(
  'test/no-misused-promises/valid-no-misused-promises.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a for...of loop with await to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
