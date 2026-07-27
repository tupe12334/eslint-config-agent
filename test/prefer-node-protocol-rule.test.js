/**
 * Integration test for the `n/prefer-node-protocol` rule shipped by
 * eslint-config-agent.
 *
 * Node.js built-in modules can be imported with a bare name (`'fs'`, `'path'`)
 * or with the explicit `node:` URL protocol prefix (`'node:fs'`, `'node:path'`).
 * The bare form is ambiguous — a reader (and a bundler) must consult
 * `package.json` to confirm the name is not a userland npm package shadowing
 * the built-in. The `node:` prefix is unambiguous at a glance and has been
 * supported since Node 14.18.0, the minimum the `engines` field already
 * requires. This guard prevents accidental removal of the rule and documents
 * the expected behavior. Run as a standalone node script by
 * `scripts/test-runner.js` (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const nodeProtocolMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'prefer-node-protocol-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'n/prefer-node-protocol'
  )
}

console.log('Testing n/prefer-node-protocol rule from the shipped config...')

// Bare `'fs'` import must be flagged — ambiguous between the built-in and a
// hypothetical userland package of the same name.
const bareFsMessages = await nodeProtocolMessages(
  `import fs from 'fs'
export const read = path => fs.readFileSync(path, 'utf8')
`
)
assert.ok(bareFsMessages.length > 0, "Expected import from 'fs' to be flagged")
assert.strictEqual(
  bareFsMessages[0].severity,
  2,
  'n/prefer-node-protocol should be an error'
)

// Bare `'path'` import must also be flagged.
const barePathMessages = await nodeProtocolMessages(
  `import { join } from 'path'
export const resolve = (...parts) => join(...parts)
`
)
assert.ok(
  barePathMessages.length > 0,
  "Expected import from 'path' to be flagged"
)
assert.strictEqual(
  barePathMessages[0].severity,
  2,
  'n/prefer-node-protocol should be an error for path'
)

// The explicit `node:` prefix form must NOT be flagged.
const nodeFsMessages = await nodeProtocolMessages(
  `import fs from 'node:fs'
export const read = path => fs.readFileSync(path, 'utf8')
`
)
assert.strictEqual(
  nodeFsMessages.length,
  0,
  "Did not expect import from 'node:fs' to be flagged"
)

// A userland npm package must NOT be flagged — the rule only targets Node.js
// built-ins, not arbitrary module names that happen to look like built-ins.
const axiosMessages = await nodeProtocolMessages(
  `import axios from 'axios'
export const get = url => axios.get(url)
`
)
assert.strictEqual(
  axiosMessages.length,
  0,
  "Did not expect import from 'axios' to be flagged"
)

console.log('✅ All tests passed!')
