import { noUnusedModulesConfig } from './no-unused-modules/index.js'
import { groupExportsConfig } from './group-exports/index.js'

export const importRules = {
  // Import/export organization and restrictions
  ...groupExportsConfig,
  'import/no-default-export': 'off', // Allow default exports
  'import/no-namespace': 'error',
  ...noUnusedModulesConfig,
  // Disabled import rules (keep existing behavior)
  'import/extensions': ['off'],
  'import/no-extraneous-dependencies': ['off'],
  'import/no-unresolved': 'off',
  'import/no-absolute-path': 'off',
  'import/order': [
    'error',
    {
      'newlines-between': 'never',
    },
  ],
  'import/newline-after-import': 'off',
  'import/first': 'error',
  'import/prefer-default-export': 'off',
  // Import hygiene: collapse duplicate import statements from the same module
  // and forbid exporting mutable bindings (export let/var), which create
  // shared mutable state across modules and are a common AI-generated footgun.
  'import/no-duplicates': 'error',
  'import/no-mutable-exports': 'error',
  // Forbid circular dependencies between modules. Cycles cause subtle,
  // order-dependent runtime bugs (a module observing a half-initialized
  // import as `undefined`) that are notoriously hard to trace, and they
  // signal tangled module boundaries — exactly the kind of implicit
  // structure this config exists to surface. `maxDepth: Infinity` follows
  // the full import graph so deep cycles are caught too.
  'import/no-cycle': ['error', { maxDepth: Infinity }],
  // A module importing itself is always a mistake (usually a copy-paste or a
  // bad auto-import) and produces a degenerate cycle; flag it explicitly.
  'import/no-self-import': 'error',
}
