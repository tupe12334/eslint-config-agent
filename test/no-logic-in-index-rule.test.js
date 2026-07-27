/**
 * Integration test for the `ddd/no-logic-in-index` rule shipped by
 * eslint-config-agent.
 *
 * `ddd/require-spec-file` already exempts `index.js`/`index.ts` from the
 * "every source file needs a spec" requirement, on the assumption that a
 * barrel file only re-exports another module's public surface and has
 * nothing of its own to test. `ddd/no-logic-in-index` enforces the other
 * half of that assumption: it flags a real function/class defined directly
 * in an `index.*` file, so logic can no longer hide in a file that is
 * exempt from spec-file coverage. The shared config must flag a function
 * declared in an index file and leave a pure re-export barrel alone.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noLogicInIndexMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === 'ddd/no-logic-in-index'
  )
}

console.log('Testing no-logic-in-index rule from the shipped config...')

// A function declared directly in an index file must be flagged.
const invalid = await noLogicInIndexMessages(
  'test/no-logic-in-index/invalid/index.ts'
)
assert.strictEqual(
  invalid.length,
  1,
  `Expected the function defined in the index file to be flagged by no-logic-in-index, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-logic-in-index should be an error'
)

// A pure re-export barrel must not be flagged.
const valid = await noLogicInIndexMessages(
  'test/no-logic-in-index/valid/index.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a pure re-export barrel to be flagged by no-logic-in-index, got ${valid.length}`
)

console.log('✅ All tests passed!')
