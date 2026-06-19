/**
 * Integration test for the `no-unreachable-loop` rule shipped by
 * eslint-config-agent.
 *
 * A loop whose body always exits on the first iteration (every path ends in
 * `return`, `break` or `throw`) can never run a second pass, so the loop reads
 * as "iterate every element" but silently checks only the first one. This is
 * the classic "find the first match" mistake — a misplaced `return`/`break`
 * collapses a search into a single check — a wrong-result correctness bug that
 * type checking does not catch and that AI assistants emit when they flatten a
 * search into a loop. The shared config must flag those loops while still
 * accepting loops that can legitimately iterate more than once. This guards
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

const unreachableLoopMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-unreachable-loop-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-unreachable-loop'
  )
}

console.log('Testing no-unreachable-loop rule from the shipped config...')

// A loop that returns on every path can only ever run once and must be flagged.
const alwaysReturns = await unreachableLoopMessages(
  'export const first = (items) => {\n' +
    '  for (const item of items) {\n' +
    '    return item\n' +
    '  }\n' +
    '  return null\n' +
    '}\n'
)
assert.ok(
  alwaysReturns.length > 0,
  'Expected a loop that returns on the first iteration to be flagged by no-unreachable-loop'
)
assert.strictEqual(
  alwaysReturns[0].severity,
  2,
  'no-unreachable-loop should be an error'
)

// A loop that unconditionally breaks on the first iteration must be flagged.
const alwaysBreaks = await unreachableLoopMessages(
  'export const firstOrNull = (items) => {\n' +
    '  let found = null\n' +
    '  for (const item of items) {\n' +
    '    found = item\n' +
    '    break\n' +
    '  }\n' +
    '  return found\n' +
    '}\n'
)
assert.ok(
  alwaysBreaks.length > 0,
  'Expected a loop that breaks on the first iteration to be flagged by no-unreachable-loop'
)

// A loop that can iterate more than once (it only returns conditionally) must
// pass.
const iterates = await unreachableLoopMessages(
  'export const find = (items, predicate) => {\n' +
    '  for (const item of items) {\n' +
    '    if (predicate(item)) {\n' +
    '      return item\n' +
    '    }\n' +
    '  }\n' +
    '  return null\n' +
    '}\n'
)
assert.strictEqual(
  iterates.length,
  0,
  'Did not expect a loop that only exits conditionally to be flagged'
)

console.log('✅ All tests passed!')
