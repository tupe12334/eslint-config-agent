/**
 * Integration test for the `react/hook-use-state` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a `useState` pair whose setter name does not
 * follow the `set<Capitalize(stateName)>` convention
 * (e.g. `const [data, handleUpdate] = useState()`) and accept pairs that
 * do follow the convention (e.g. `const [data, setData] = useState()`).
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const hookUseStateMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'hook-use-state-sample.jsx',
  })
  return result.messages.filter(
    message => message.ruleId === 'react/hook-use-state'
  )
}

console.log('Testing react/hook-use-state rule from the shipped config...')

// A setter that does not follow `set<StateName>` must be flagged.
const badNaming = await hookUseStateMessages(
  "import React, { useState } from 'react';\nexport const Comp = () => { const [data, handleUpdate] = useState(null); return <div />; };\n"
)
assert.ok(
  badNaming.length > 0,
  'Expected a misnamed useState setter to be flagged by react/hook-use-state'
)
assert.strictEqual(
  badNaming[0].severity,
  2,
  'react/hook-use-state should be an error'
)

// A correctly named pair must pass.
const goodNaming = await hookUseStateMessages(
  "import React, { useState } from 'react';\nexport const Comp = () => { const [data, setData] = useState(null); return <div />; };\n"
)
assert.strictEqual(
  goodNaming.length,
  0,
  'Did not expect a correctly named useState pair to be flagged by react/hook-use-state'
)

console.log('✅ All tests passed!')
