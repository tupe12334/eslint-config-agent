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
}
