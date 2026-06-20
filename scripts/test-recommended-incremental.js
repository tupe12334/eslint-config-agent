#!/usr/bin/env node
/* eslint-disable security/detect-object-injection */

/**
 * Behavior guard for `eslint-config-agent/recommended-incremental`: the
 * `recommended` (relaxed) config with every surviving error-level rule
 * downgraded to a warning. It must keep both promises at once — no error
 * survives (CI stays green) and the rules `recommended` disables stay off (the
 * relaxation is not silently re-enabled as warnings).
 */

import assert from 'assert'
import recommended from '../exports/recommended.js'
import preset from '../exports/recommended-incremental.js'

const failures = []

const check = (label, fn) => {
  try {
    fn()
    console.log(`✅ ${label}`)
  } catch (error) {
    failures.push(`${label}: ${error.message}`)
    console.error(`❌ ${label}`)
  }
}

const severityOf = value => (Array.isArray(value) ? value[0] : value)
const isError = value =>
  severityOf(value) === 'error' || severityOf(value) === 2
const isOff = value => severityOf(value) === 'off' || severityOf(value) === 0

const eachRule = visit =>
  recommended.forEach((block, index) => {
    if (block.rules === undefined) {
      return
    }
    const warned = preset[index] ? preset[index].rules : undefined
    for (const [name, value] of Object.entries(block.rules)) {
      visit(name, value, warned)
    }
  })

check('same number of blocks as recommended', () => {
  assert.strictEqual(preset.length, recommended.length)
})

check('contains no error-level rules', () => {
  for (const block of preset) {
    if (block.rules === undefined) {
      continue
    }
    for (const [name, value] of Object.entries(block.rules)) {
      assert.ok(!isError(value), `rule "${name}" still set to error`)
    }
  }
})

check(
  'every recommended error rule becomes a warning (options preserved)',
  () => {
    let checked = 0
    eachRule((name, value, warned) => {
      if (!isError(value)) {
        return
      }
      assert.strictEqual(
        severityOf(warned[name]),
        'warn',
        `"${name}" not warned`
      )
      if (!Array.isArray(value) || value.length <= 1) {
        return
      }
      assert.deepStrictEqual(warned[name].slice(1), value.slice(1))
      checked += 1
    })
    assert.ok(checked > 0, 'expected a tuple-form error rule to verify')
  }
)

check('rules disabled by recommended stay disabled', () => {
  let checked = 0
  eachRule((name, value, warned) => {
    if (!isOff(value)) {
      return
    }
    assert.deepStrictEqual(warned[name], value, `"${name}" no longer off`)
    checked += 1
  })
  assert.ok(checked > 0, 'expected a disabled recommended override')
})

if (failures.length > 0) {
  console.error('\n❌ recommended-incremental preset check failed:')
  for (const failure of failures) {
    console.error(`   - ${failure}`)
  }
  process.exit(1)
}

console.log('\n✅ recommended-incremental preset behaves as documented.')
