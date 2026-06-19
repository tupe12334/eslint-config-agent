/**
 * Integration test for the `no-useless-rename` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject renaming an import, export or destructured
 * binding to the same name (`import { foo as foo }`, `export { bar as bar }`,
 * `const { baz: baz } = obj`) and accept the equivalent form without the
 * redundant alias. This guards against accidental removal of the rule and
 * documents the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
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

// A destructuring rename to the same name must be flagged.
const uselessDestructure = await noUselessRenameMessages(
  'export const unwrap = obj => {\n' +
    '  const { value: value } = obj\n' +
    '  return value\n' +
    '}\n'
)
assert.ok(
  uselessDestructure.length > 0,
  'Expected `{ value: value }` to be flagged by no-useless-rename'
)
assert.strictEqual(
  uselessDestructure[0].severity,
  2,
  'no-useless-rename should be an error'
)

// An export renamed to the same name must be flagged.
const uselessExport = await noUselessRenameMessages(
  'const total = 1\n' + 'export { total as total }\n'
)
assert.ok(
  uselessExport.length > 0,
  'Expected `export { total as total }` to be flagged by no-useless-rename'
)

// The form without the redundant alias must pass.
const noRename = await noUselessRenameMessages(
  'export const unwrap = obj => {\n' +
    '  const { value } = obj\n' +
    '  return value\n' +
    '}\n'
)
assert.strictEqual(
  noRename.length,
  0,
  'Did not expect the plain destructuring form to be flagged by no-useless-rename'
)

// A genuine rename to a different name must also pass.
const realRename = await noUselessRenameMessages(
  'export const unwrap = obj => {\n' +
    '  const { value: amount } = obj\n' +
    '  return amount\n' +
    '}\n'
)
assert.strictEqual(
  realRename.length,
  0,
  'Did not expect a genuine rename to be flagged by no-useless-rename'
)

console.log('✅ All tests passed!')
