#!/usr/bin/env node
/* eslint-disable security/detect-object-injection, early-return/prefer-early-continue */

/**
 * Behavior guard for the `eslint-config-agent/incremental` entry point.
 *
 * Asserts the promises the preset makes relative to the base config:
 *
 *   1. It has the same shape — one warned block per base block.
 *   2. Every error-level rule is downgraded to a warning, while `off`/`warn`
 *      rules and rule options are left intact.
 *   3. No error-level rule survives, so consuming it cannot make `eslint` exit
 *      non-zero on its own.
 */

import assert from 'assert'
import baseConfig from '../index.js'
import incremental from '../exports/incremental.js'

const failures = []

function check(label, fn) {
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

check('incremental has the same number of blocks as the base config', () => {
  assert.strictEqual(incremental.length, baseConfig.length)
})

check('incremental contains no error-level rules', () => {
  for (const block of incremental) {
    if (block.rules === undefined) {
      continue
    }
    for (const [name, value] of Object.entries(block.rules)) {
      assert.ok(
        !isError(value),
        `rule "${name}" is still set to error in the incremental preset`
      )
    }
  }
})

check('every base error rule becomes a warning at the same position', () => {
  baseConfig.forEach((block, index) => {
    if (block.rules === undefined) {
      return
    }
    const warned = incremental[index].rules
    for (const [name, value] of Object.entries(block.rules)) {
      if (isError(value)) {
        assert.strictEqual(
          severityOf(warned[name]),
          'warn',
          `expected "${name}" to be downgraded to warn`
        )
      }
    }
  })
})

check('rule options are preserved when severity is downgraded', () => {
  // Find any base rule expressed as a tuple with an error severity and options.
  let checked = 0
  baseConfig.forEach((block, index) => {
    if (block.rules === undefined) {
      return
    }
    for (const [name, value] of Object.entries(block.rules)) {
      if (Array.isArray(value) && isError(value) && value.length > 1) {
        const warned = incremental[index].rules[name]
        assert.deepStrictEqual(warned.slice(1), value.slice(1))
        assert.strictEqual(warned[0], 'warn')
        checked += 1
      }
    }
  })
  assert.ok(
    checked > 0,
    'expected at least one tuple-form error rule to verify'
  )
})

check('off and warn rules are left unchanged', () => {
  baseConfig.forEach((block, index) => {
    if (block.rules === undefined) {
      return
    }
    const warned = incremental[index].rules
    for (const [name, value] of Object.entries(block.rules)) {
      if (!isError(value)) {
        assert.deepStrictEqual(warned[name], value)
      }
    }
  })
})

if (failures.length > 0) {
  console.error('\n❌ incremental preset check failed:')
  for (const failure of failures) {
    console.error(`   - ${failure}`)
  }
  process.exit(1)
}

console.log('\n✅ incremental preset behaves as documented.')
