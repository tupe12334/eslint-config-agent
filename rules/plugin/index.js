import { securityRules } from './security/index.js'
import { importRules } from './import/index.js'
import { reactRules } from './react/index.js'
import { nRules } from './n/index.js'
import { classExportRules } from './class-export/index.js'

export const pluginRules = {
  ...securityRules,
  ...importRules,
  ...reactRules,
  ...nRules,
  ...classExportRules,
}
