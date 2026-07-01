/**
 * Shared rule-severity assertions for `scripts/test-recommended.js`.
 *
 * Resolves a rule's effective `[severity, options]` for a source path under
 * both the strict default config and the `recommended` preset, and asserts
 * each rule in `RULE_CHECKS` matches its expected relaxed severity (and, for
 * the length rules, its preserved numeric threshold).
 */

import { join } from 'node:path'
import { ESLint } from 'eslint'

// Rules the recommended preset must relax or downgrade, each checked at real
// source paths (NOT under `test/`, `configs/`, etc., where these rules are
// already exempt in both strict and recommended) so the check reflects what
// an adopting codebase actually sees.
//
// - `jsdoc/require-jsdoc` (issue #91) and the spec-file requirement — split
//   across `ddd/require-spec-file` (.js/.ts) and the bundled
//   `custom/require-spec-file-tsx` (.tsx/.jsx) — are fully disabled (0).
// - `max-lines-per-function`/`max-lines` (issue #85) keep the strict
//   default's 70/100-line thresholds but are downgraded from error (2) to
//   warn (1), so a real codebase's legacy long functions/files surface as
//   backlog instead of failing CI.
const RULE_CHECKS = [
  { ruleId: 'jsdoc/require-jsdoc', paths: ['src/example.ts'], relaxed: 0 },
  {
    ruleId: 'custom/require-spec-file-tsx',
    paths: ['src/example.tsx', 'src/example.jsx'],
    relaxed: 0,
  },
  {
    ruleId: 'max-lines-per-function',
    paths: ['src/example.ts'],
    relaxed: 1,
    maxLines: 70,
  },
  { ruleId: 'max-lines', paths: ['src/example.ts'], relaxed: 1, maxLines: 100 },
]

// Resolve a rule's effective `[severity, options]` for a source path. ESLint
// normalizes severities to numbers (0 = off, 1 = warn, 2 = error).
async function resolveRule(configFile, ruleId, sourcePath) {
  const eslint = new ESLint({ overrideConfigFile: configFile })
  const resolved = await eslint.calculateConfigForFile(sourcePath)
  // eslint-disable-next-line security/detect-object-injection -- ruleId comes from the hardcoded RULE_CHECKS table above
  const entry = resolved.rules[ruleId]
  if (entry === undefined) {
    return { severity: 0, options: undefined }
  }
  return Array.isArray(entry)
    ? { severity: entry[0], options: entry[1] }
    : { severity: entry, options: undefined }
}

function checkThresholds(failures, ruleId, strict, relaxed, maxLines) {
  if (maxLines === undefined) {
    return
  }
  if (strict.options?.max !== maxLines) {
    failures.push(`strict ${ruleId} threshold should be ${maxLines}`)
  }
  if (relaxed.options?.max !== maxLines) {
    failures.push(`recommended ${ruleId} threshold should stay ${maxLines}`)
  }
}

// Flatten each `RULE_CHECKS` entry's `paths` into one case per (ruleId, path).
function toCases() {
  return RULE_CHECKS.flatMap(({ ruleId, paths, relaxed, maxLines }) =>
    paths.map(path => ({ ruleId, path, relaxed, maxLines }))
  )
}

// Resolve strict/relaxed severity for one case and collect any failures.
async function checkCase(projectRoot, strictConfig, recommendedConfig, check) {
  const { ruleId, path, relaxed: expectedRelaxed, maxLines } = check
  const sourcePath = join(projectRoot, path)
  const [strict, relaxed] = await Promise.all([
    resolveRule(strictConfig, ruleId, sourcePath),
    resolveRule(recommendedConfig, ruleId, sourcePath),
  ])
  console.log(
    `\n${ruleId} (${path}): strict=${strict.severity} recommended=${relaxed.severity}`
  )
  const failures = []
  if (strict.severity !== 2) {
    failures.push(`strict should keep ${ruleId} at error for ${path}`)
  }
  if (relaxed.severity !== expectedRelaxed) {
    failures.push(
      `recommended should set ${ruleId} to ${expectedRelaxed} for ${path}`
    )
  }
  checkThresholds(failures, ruleId, strict, relaxed, maxLines)
  return failures
}

// The strict default must keep every checked rule at error (2), with its
// documented threshold where one applies. The recommended preset must match
// each rule's expected relaxed severity while preserving the same threshold.
export async function assertRuleChecks(
  projectRoot,
  strictConfig,
  recommendedConfig
) {
  const results = await Promise.all(
    toCases().map(check =>
      checkCase(projectRoot, strictConfig, recommendedConfig, check)
    )
  )
  const failures = results.flat()
  if (failures.length === 0) {
    return
  }
  console.error(`❌ ${failures.join('; ')}`)
  process.exit(1)
}
