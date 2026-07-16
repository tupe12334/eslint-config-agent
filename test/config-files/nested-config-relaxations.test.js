/**
 * Integration test for the config-file relaxations shipped by
 * eslint-config-agent.
 *
 * The `configFilesConfig` block disables a handful of rules that legitimately
 * fire on configuration files (`default/no-localhost`,
 * `default/no-hardcoded-urls`, `max-lines`, ...). Those relaxations must apply
 * to config files wherever they live — including nested ones in a monorepo
 * such as `apps/web/eslint.config.mjs` or `packages/ui/vitest.config.mjs` —
 * not just files at the repository root.
 *
 * Before the recursive-glob fix, the block matched only root-level config
 * files (`*.config.{...}` / `eslint.config.{...}`), so a nested
 * `eslint.config.mjs` / `vite.config.mjs` got hit with `default/no-localhost`
 * and `default/no-hardcoded-urls` errors even though it is plainly a config
 * file. This guards against that regression. Run as a standalone node script
 * by scripts/test-runner.js (exit code 0 = pass).
 *
 * Note: the fixtures use `.mjs`, not `.ts`. A virtual `.ts` filePath cannot be
 * linted via `lintText` here because the type-aware parser's project service
 * rejects a path that is not part of a real tsconfig. `.mjs` config files
 * exercise the exact same `configFilesConfig` glob without needing type info,
 * and mirror the `eslint.config.mjs` files real consumers ship.
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

// A config file that legitimately references localhost and a hardcoded URL —
// exactly what a dev-server proxy or API base in a build config looks like.
const configFileSource = [
  'export const cfg = {',
  "  devServer: 'http://localhost:3000',",
  "  apiBase: 'https://api.example.com/v1',",
  '}',
  '',
].join('\n')

const relaxedRuleIds = new Set([
  'default/no-localhost',
  'default/no-hardcoded-urls',
])

const relaxedErrorsFor = async filePath => {
  const [result] = await eslint.lintText(configFileSource, { filePath })
  return result.messages.filter(message => relaxedRuleIds.has(message.ruleId))
}

console.log('Testing config-file relaxations reach nested config files...')

// Root config files have always been relaxed; assert that still holds so this
// test fails loudly if the globs ever stop matching at all.
const rootConfig = await relaxedErrorsFor('eslint.config.mjs')
assert.strictEqual(
  rootConfig.length,
  0,
  `Root eslint.config.mjs should be relaxed, got: ${rootConfig
    .map(m => m.ruleId)
    .join(', ')}`
)

// The regression: nested config files in a monorepo must be relaxed too.
const nestedPaths = [
  'apps/web/eslint.config.mjs',
  'packages/ui/vitest.config.mjs',
  'services/api/build.config.cjs',
]

for (const filePath of nestedPaths) {
  const violations = await relaxedErrorsFor(filePath)
  assert.strictEqual(
    violations.length,
    0,
    `Nested config file ${filePath} should get the config-file relaxations, ` +
      `but reported: ${violations.map(m => m.ruleId).join(', ')}`
  )
}

// Sanity check the fixture is actually exercising the rules: the same source
// at a non-config path is still flagged, so the assertions above prove the
// relaxation matched rather than the rules being globally inert.
const regularPath = await relaxedErrorsFor('apps/web/server.mjs')
assert.ok(
  regularPath.length > 0,
  'Expected localhost/hardcoded-url rules to fire on a non-config source file'
)

console.log('✅ All tests passed!')
