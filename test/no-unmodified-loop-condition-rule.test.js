/**
 * Integration test for the `no-unmodified-loop-condition` rule shipped by
 * eslint-config-agent.
 *
 * A loop whose condition tests a variable that is never modified inside the
 * body is almost always a bug — an unintended infinite loop or a forgotten
 * increment. TypeScript cannot catch it (the code is well-typed; the variable
 * just keeps its initial value), making it exactly the kind of quiet,
 * wrong-behavior bug AI assistants emit when they scaffold a loop and lose
 * track of what advances it. The shared config must flag the unmodified-
 * condition form while leaving a properly-advancing loop alone. This guards
 * against accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 =
 * pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const messagesFor = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-unmodified-loop-condition-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-unmodified-loop-condition'
  )
}

console.log(
  'Testing no-unmodified-loop-condition rule from the shipped config...'
)

// A `while` loop whose condition tests `i` but whose body never changes `i`
// must be flagged — this is an infinite loop waiting to happen.
const unmodifiedCondition = await messagesFor(
  `export function run(limit) {
  let i = 0
  while (i < limit) {
    doWork()
  }
}
`
)
assert.ok(
  unmodifiedCondition.length > 0,
  'Expected a loop with an unmodified condition variable to be flagged'
)
assert.strictEqual(
  unmodifiedCondition[0].severity,
  2,
  'no-unmodified-loop-condition should be an error'
)

// A `while` loop that increments the condition variable inside the body must
// pass — the condition is modified and the loop terminates normally.
const properlyAdvancing = await messagesFor(
  `export function run(limit) {
  let i = 0
  while (i < limit) {
    doWork()
    i++
  }
}
`
)
assert.strictEqual(
  properlyAdvancing.length,
  0,
  'Did not expect a properly-advancing loop to be flagged'
)

console.log('✅ All tests passed!')
