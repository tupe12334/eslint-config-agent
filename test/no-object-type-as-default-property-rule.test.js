/**
 * Integration test for the `react/no-object-type-as-default-prop` rule
 * shipped by eslint-config-agent.
 *
 * The shared config must flag a component that uses an inline object literal,
 * array literal, or function literal as the default value for a destructured
 * prop — these create a new reference on every render and silently break
 * `React.memo`, `useEffect`, and `useMemo` dependency comparisons. The config
 * must accept a primitive default and a stable module-level constant. This test
 * guards against accidental removal of the rule and documents the intended
 * behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const defaultPropertyMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-object-type-as-default-prop-sample.jsx',
  })
  return result.messages.filter(
    message => message.ruleId === 'react/no-object-type-as-default-prop'
  )
}

console.log(
  'Testing react/no-object-type-as-default-prop rule from the shipped config...'
)

// An inline array literal as a prop default must be flagged.
const arrayDefault = await defaultPropertyMessages(
  "import React from 'react'\n" +
    'export const List = ({ items = [] }) => {\n' +
    '  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>\n' +
    '}\n'
)
assert.ok(
  arrayDefault.length > 0,
  'Expected an inline [] prop default to be flagged by react/no-object-type-as-default-prop'
)
assert.strictEqual(
  arrayDefault[0].severity,
  2,
  'react/no-object-type-as-default-prop should be an error'
)

// An inline object literal as a prop default must be flagged.
const objectDefault = await defaultPropertyMessages(
  "import React from 'react'\n" +
    'export const Card = ({ style = {} }) => {\n' +
    '  return <div style={style}>content</div>\n' +
    '}\n'
)
assert.ok(
  objectDefault.length > 0,
  'Expected an inline {} prop default to be flagged by react/no-object-type-as-default-prop'
)

// A primitive default must not be flagged.
const primitiveDefault = await defaultPropertyMessages(
  "import React from 'react'\n" +
    'export const Counter = ({ count = 0 }) => {\n' +
    '  return <span>{count}</span>\n' +
    '}\n'
)
assert.strictEqual(
  primitiveDefault.length,
  0,
  'Did not expect a primitive prop default to be flagged by react/no-object-type-as-default-prop'
)

console.log('✅ All tests passed!')
