/**
 * Integration test for the `no-unreachable-loop` rule shipped by
 * eslint-config-agent.
 *
 * A loop whose body always exits on the first iteration (via `return`,
 * `break`, or `throw`) can never reach a second pass — it reads as "iterate
 * every element" but runs at most once. The shared config must flag this
 * wrong-result correctness bug while leaving loops that can iterate multiple
 * times alone. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const unreachableLoopMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-unreachable-loop-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-unreachable-loop'
  )
}

console.log('Testing no-unreachable-loop rule from the shipped config...')

// A `for-of` loop that returns unconditionally on every path — the first
// iteration is the only iteration, so all elements after the first are
// silently ignored.
const alwaysExits = await unreachableLoopMessages(
  `export const findFirst = items => {
  for (const item of items) {
    if (item.active) return item
    return null
  }
}
`
)
assert.ok(
  alwaysExits.length > 0,
  'Expected a loop that always exits on the first iteration to be flagged'
)
assert.strictEqual(
  alwaysExits[0].severity,
  2,
  'no-unreachable-loop should be an error'
)

// A loop with a conditional exit that leaves a path reaching the next
// iteration must pass — it genuinely iterates.
const conditionalExit = await unreachableLoopMessages(
  `export const findFirst = items => {
  for (const item of items) {
    if (item.active) return item
  }
  return null
}
`
)
assert.strictEqual(
  conditionalExit.length,
  0,
  'Did not expect a loop with a conditional exit to be flagged'
)

console.log('✅ All tests passed!')
