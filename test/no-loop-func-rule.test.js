/**
 * Integration test for the `@typescript-eslint/no-loop-func` rule shipped by
 * eslint-config-agent.
 *
 * A function declared inside a loop captures its outer variables by reference,
 * so a closure that closes over a binding the loop reassigns sees that binding's
 * final value rather than the per-iteration value it looks like it captures —
 * the classic closure-over-a-mutated-loop-variable bug. It is exactly the
 * shortcut an AI assistant emits when it lifts a closure into a loop body
 * without checking what it captures. The shared config must flag the unsafe
 * closure (one that reads a reassigned loop variable) while leaving the safe
 * form (capturing a fresh per-iteration `const`) alone. This guards against
 * accidental removal of the rule and documents the intended behavior.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noLoopFuncMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-loop-func'
  )
}

console.log('Testing no-loop-func rule from the shipped config...')

// A closure created in the loop that closes over the reassigned `total` must be
// flagged.
const invalid = await noLoopFuncMessages(
  'test/no-loop-func/invalid-no-loop-func.ts'
)
assert.ok(
  invalid.length >= 1,
  `Expected the loop-defined closure over a reassigned variable to be flagged by no-loop-func, got ${invalid.length}`
)
assert.strictEqual(invalid[0].severity, 2, 'no-loop-func should be an error')

// Capturing a fresh per-iteration `const` must pass.
const valid = await noLoopFuncMessages(
  'test/no-loop-func/valid-no-loop-func.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a closure over a per-iteration const to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
