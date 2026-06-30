/**
 * Integration test verifying that `@typescript-eslint/prefer-nullish-coalescing`
 * is turned OFF in eslint-config-agent.
 *
 * This config deliberately bans the `??` operator via `no-restricted-syntax`
 * (see `noNullishCoalescingConfig`) and prefers explicit null/undefined checks.
 * The `stylisticTypeChecked` preset enables `prefer-nullish-coalescing`, which
 * would tell users to replace `||` with `??` — directly contradicting the ban
 * and leaving users with two conflicting errors they cannot resolve.
 *
 * This test guards against accidentally re-enabling the rule and documents the
 * intentional design decision. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

// Use the real eslint.config.js so the TypeScript project service is active
// and type-aware rules (including prefer-nullish-coalescing) can run.
const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

console.log('Testing that prefer-nullish-coalescing is disabled...')

// `||` with a nullable typed variable must NOT trigger prefer-nullish-coalescing.
// If the rule were on, it would report: "Prefer using nullish coalescing
// operator (`??`) instead of a logical or (`||`)". We turn it off because the
// config deliberately bans `??` — the suggestion would be unresolvable.
const [nullableOrResult] = await eslint.lintFiles([
  'test/prefer-nullish-coalescing/or-with-nullable.ts',
])
const preferNullishMessages = nullableOrResult.messages.filter(
  m => m.ruleId === '@typescript-eslint/prefer-nullish-coalescing'
)
assert.strictEqual(
  preferNullishMessages.length,
  0,
  `@typescript-eslint/prefer-nullish-coalescing must be disabled — its suggestion to use ?? contradicts the no-restricted-syntax ban on ??. Got ${preferNullishMessages.length} message(s): ${preferNullishMessages.map(m => m.message).join(', ')}`
)

// Sanity-check: the ?? operator is still banned by no-restricted-syntax
// even for JavaScript files (where the ban also applies via sharedRules).
const { default: configModule } = await import('../index.js')
const eslintJs = new ESLint({
  overrideConfigFile: true,
  overrideConfig: configModule,
})
const code = "export const s = null\nexport const r = s ?? 'default'\n"
const [jsResult] = await eslintJs.lintText(code, {
  filePath: 'ban-check-sample.js',
})
const banMessages = jsResult.messages.filter(
  m => m.ruleId === 'no-restricted-syntax'
)
assert.ok(
  banMessages.length > 0,
  'Expected ?? to be flagged by no-restricted-syntax (the intentional ban must remain active)'
)

console.log('✅ All tests passed!')
