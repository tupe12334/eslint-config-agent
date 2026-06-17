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
  // Forbid circular import dependencies (A imports B imports A). Cycles cause
  // order-dependent runtime bugs where a module reads a not-yet-initialized
  // binding from its partner and silently sees `undefined`, defeat tree
  // shaking, and are a reliable signal of tangled, hard-to-follow module
  // boundaries. They are also a frequent AI-generated footgun, since an
  // assistant editing one file cannot see the import graph it closes. Detect
  // them statically. `ignoreExternal` skips traversal into node_modules for
  // performance, since cycles inside dependencies are not the consumer's to fix.
  'import/no-cycle': ['error', { ignoreExternal: true }],
}
