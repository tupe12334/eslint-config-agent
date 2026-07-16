/**
 * Integration test for the `logical-assignment-operators` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must require the logical-assignment shorthand: a
 * conditional self-assignment written longhand (`x = x || y`, `x = x && y`,
 * `x = x ?? y`) has to be flagged so it collapses to `x ||= y`, `x &&= y`, or
 * `x ??= y`, while code already using the shorthand — or that is not a
 * conditional self-assignment at all — must pass. This guards against accidental
 * removal of the rule and documents the intended behavior. Run as a standalone
 * node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const logicalAssignMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'logical-assignment-operators-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'logical-assignment-operators'
  )
}

console.log(
  'Testing logical-assignment-operators rule from the shipped config...'
)

// Longhand `||` self-assignment must be flagged.
const longhandOr = await logicalAssignMessages(
  'export const withDefault = (options) => {\n  let value = options.value\n  value = value || "default"\n  return value\n}\n'
)
assert.ok(
  longhandOr.length > 0,
  'Expected `x = x || y` to be flagged by the logical-assignment-operators rule'
)
assert.strictEqual(
  longhandOr[0].severity,
  2,
  'logical-assignment-operators should be an error'
)

// Longhand `&&` self-assignment must be flagged.
const longhandAnd = await logicalAssignMessages(
  'export const withFlag = (options) => {\n  let flag = options.flag\n  flag = flag && options.extra\n  return flag\n}\n'
)
assert.ok(
  longhandAnd.length > 0,
  'Expected `x = x && y` to be flagged by the logical-assignment-operators rule'
)

// Longhand `??` self-assignment must be flagged.
const longhandNullish = await logicalAssignMessages(
  'export const withFallback = (options) => {\n  let name = options.name\n  name = name ?? "anonymous"\n  return name\n}\n'
)
assert.ok(
  longhandNullish.length > 0,
  'Expected `x = x ?? y` to be flagged by the logical-assignment-operators rule'
)

// Already-shorthand forms must pass.
const shorthandOr = await logicalAssignMessages(
  'export const withDefault = (options) => {\n  let value = options.value\n  value ||= "default"\n  return value\n}\n'
)
assert.strictEqual(
  shorthandOr.length,
  0,
  'Did not expect `x ||= y` to be flagged by the logical-assignment-operators rule'
)

const shorthandNullish = await logicalAssignMessages(
  'export const withFallback = (options) => {\n  let name = options.name\n  name ??= "anonymous"\n  return name\n}\n'
)
assert.strictEqual(
  shorthandNullish.length,
  0,
  'Did not expect `x ??= y` to be flagged by the logical-assignment-operators rule'
)

// A plain assignment (not a conditional self-update) must pass.
const plainAssign = await logicalAssignMessages(
  'export const reset = (state) => {\n  let count = state.count\n  count = 0\n  return count\n}\n'
)
assert.strictEqual(
  plainAssign.length,
  0,
  'Did not expect a plain assignment to be flagged by the logical-assignment-operators rule'
)

console.log('✅ All tests passed!')
