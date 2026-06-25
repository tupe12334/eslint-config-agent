/**
 * Integration test for the `no-unreachable-loop` rule shipped by
 * eslint-config-agent.
 *
 * A loop whose every code path exits on the first iteration (via `return`,
 * `throw`, `break`, or an outer-label `continue`) can never reach a second
 * pass. The classic form is a misplaced `return` that collapses a search into
 * a single check — the loop reads as "iterate every element" but only ever
 * examines the first one, a wrong-result correctness bug the type checker
 * cannot catch. The shared config must flag that form while leaving a
 * correctly-iterating loop alone. This guards against accidental removal of
 * the rule and documents the intended behavior. Run as a standalone node
 * script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noUnreachableLoopMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-unreachable-loop-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-unreachable-loop'
  )
}

console.log('Testing no-unreachable-loop rule from the shipped config...')

// A loop that unconditionally returns on the first iteration must be flagged:
// the second `return null` exits regardless of the condition, so the loop
// body can never execute a second time.
const collapsedSearch = await noUnreachableLoopMessages(
  `export const findFirst = items => {
  for (const item of items) {
    if (item > 0) return item
    return null
  }
}
`
)
assert.ok(
  collapsedSearch.length > 0,
  'Expected a loop that always returns on the first iteration to be flagged'
)
assert.strictEqual(
  collapsedSearch[0].severity,
  2,
  'no-unreachable-loop should be an error'
)

// A loop that conditionally returns and otherwise continues to the next
// iteration must pass — only the matching branch exits early.
const earlyReturn = await noUnreachableLoopMessages(
  `export const findFirst = items => {
  for (const item of items) {
    if (item > 0) return item
  }
  return null
}
`
)
assert.strictEqual(
  earlyReturn.length,
  0,
  'Did not expect a loop with a conditional early-return to be flagged'
)

// A normal accumulating loop must pass.
const accumulate = await noUnreachableLoopMessages(
  `export const sum = items => {
  let total = 0
  for (const item of items) {
    total += item
  }
  return total
}
`
)
assert.strictEqual(
  accumulate.length,
  0,
  'Did not expect an accumulating loop to be flagged'
)

console.log('✅ All tests passed!')
