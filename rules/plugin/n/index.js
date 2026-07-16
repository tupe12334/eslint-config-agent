import { noProcessEnvironmentConfig } from './no-process-env/index.js'

export const nRules = {
  'n/no-process-env': noProcessEnvironmentConfig,
  // Require the `node:` protocol prefix on every import of a Node.js built-in
  // module (e.g. `import fs from 'node:fs'` instead of `import fs from 'fs'`).
  // The bare form (`'fs'`, `'path'`, `'crypto'`) is ambiguous: without the
  // protocol, a reader (and a bundler) must consult package.json to confirm
  // that the name is not a userland npm package shadowing the built-in. The
  // `node:` prefix is unambiguous at a glance, is supported since Node 14.18.0
  // (the minimum already required by this package's `engines` field), and is
  // the form the package itself uses in all its own scripts and custom rules
  // (e.g. `import { existsSync } from 'node:fs'`). Shipping the rule in the
  // shared set means consuming projects inherit the same convention
  // automatically. The rule is auto-fixable (`eslint --fix`), so adoption is
  // free. It fires only when a built-in module is actually imported — browser
  // and React code that imports nothing from Node.js is unaffected.
  'n/prefer-node-protocol': 'error',
}
