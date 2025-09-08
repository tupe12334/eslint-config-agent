import { securityRules } from "./security/index.js";
import { importRules } from "./import/index.js";
import { jsxA11yRules } from "./jsx-a11y/index.js";
import { reactRules } from "./react/index.js";
import { nRules } from "./n/index.js";
import { classExportRules } from "./class-export/index.js";

export const pluginRules = {
  ...securityRules,
  ...importRules,
  ...jsxA11yRules,
  ...reactRules,
  ...nRules,
  ...classExportRules,
};