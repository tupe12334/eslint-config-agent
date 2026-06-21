/**
 * Integration test for the `react/jsx-no-constructed-context-values` rule
 * shipped by eslint-config-agent.
 *
 * The shared config must flag a Context Provider whose `value` is an
 * inline-constructed object/array/function (`<Ctx.Provider value={{ user }}>`),
 * which gets a brand-new reference on every render and forces every consumer of
 * the context to re-render, and must accept a stable value passed straight
 * through (a hoisted/memoized variable). This guards against accidental removal
 * of the rule and documents the intended behavior. Run as a standalone node
 * script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const constructedContextMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'jsx-no-constructed-context-values-sample.jsx',
  })
  return result.messages.filter(
    message => message.ruleId === 'react/jsx-no-constructed-context-values'
  )
}

console.log(
  'Testing react/jsx-no-constructed-context-values rule from the shipped config...'
)

// An inline object literal as the provider value must be flagged.
const constructed = await constructedContextMessages(
  "import React from 'react'\n" +
    'const Ctx = React.createContext(null)\n' +
    'export const App = ({ user }) => {\n' +
    '  return <Ctx.Provider value={{ user }}>{null}</Ctx.Provider>\n' +
    '}\n'
)
assert.ok(
  constructed.length > 0,
  'Expected an inline-constructed provider value to be flagged by react/jsx-no-constructed-context-values'
)
assert.strictEqual(
  constructed[0].severity,
  2,
  'react/jsx-no-constructed-context-values should be an error'
)

// A stable value passed straight through must pass.
const stable = await constructedContextMessages(
  "import React from 'react'\n" +
    'const Ctx = React.createContext(null)\n' +
    'export const App = ({ value }) => {\n' +
    '  return <Ctx.Provider value={value}>{null}</Ctx.Provider>\n' +
    '}\n'
)
assert.strictEqual(
  stable.length,
  0,
  'Did not expect a stable provider value to be flagged by react/jsx-no-constructed-context-values'
)

console.log('✅ All tests passed!')
