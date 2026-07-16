/**
 * Integration test for the `no-useless-rename` rule shipped by
 * eslint-config-agent.
 *
 * Renaming an import, an export, or a destructured binding to the exact name
 * it already has (`import { foo as foo }`, `export { bar as bar }`,
 * `const { baz: baz } = obj`) is pure punctuation noise — the `as`/`:` clause
 * looks like a transformation but the two sides are identical. The shared
 * config must flag all three useless-rename shapes while leaving genuine
 * renames (to a different name) alone. This guards against accidental
 * removal of the rule and documents the intended behavior.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noUselessRenameMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-useless-rename-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-useless-rename'
  )
}

console.log('Testing no-useless-rename rule from the shipped config...')

// Renaming an import to its own name must be flagged.
const importRename = await noUselessRenameMessages(`
import { value as value } from './value'
export const doubled = value * 2
`)
assert.ok(
  importRename.length > 0,
  `Expected import { value as value } to be flagged, got ${importRename.length}`
)
assert.strictEqual(
  importRename[0].severity,
  2,
  'no-useless-rename should be an error'
)

// Renaming an export to its own name must be flagged.
const exportRename = await noUselessRenameMessages(`
const value = 1
export { value as value }
`)
assert.ok(
  exportRename.length > 0,
  `Expected export { value as value } to be flagged, got ${exportRename.length}`
)

// Renaming a destructured binding to its own name must be flagged.
const destructureRename = await noUselessRenameMessages(`
const obj = { baz: 1 }
const { baz: baz } = obj
export const result = baz
`)
assert.ok(
  destructureRename.length > 0,
  `Expected const { baz: baz } to be flagged, got ${destructureRename.length}`
)

// A genuine rename (to a different name) must pass for all three shapes.
const genuineRenames = await noUselessRenameMessages(`
import { value as importedValue } from './value'
const obj = { baz: 1 }
const { baz: renamedBaz } = obj
const total = importedValue + renamedBaz
export { total as exportedTotal }
`)
assert.strictEqual(
  genuineRenames.length,
  0,
  `Did not expect genuine renames to be flagged, got ${genuineRenames.length}`
)

console.log('✅ All tests passed!')
