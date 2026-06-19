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
  // them statically. `maxDepth: Infinity` follows the full import graph so deep
  // cycles are caught too; `ignoreExternal` skips traversal into node_modules
  // for performance, since cycles inside dependencies are not the consumer's
  // to fix.
  'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],
  // A module importing itself is always a mistake (usually a copy-paste or a
  // bad auto-import) and produces a degenerate cycle; flag it explicitly.
  'import/no-self-import': 'error',
  // Forbid empty named import blocks (`import {} from 'mod'`). An empty block
  // is the residue of deleting the last named binding from an import: the
  // statement now pulls in nothing yet still reads as if it imports names,
  // which misleads readers and quietly keeps a dead dependency edge alive. A
  // bare side-effect import (`import 'mod'`) — or removing the line — states
  // the real intent. This is a frequent leftover from AI-assisted edits that
  // rewrite an import list one binding at a time, putting it squarely in scope
  // for this config's explicit-over-clever stance. The rule is auto-fixable.
  'import/no-empty-named-blocks': 'error',
}
