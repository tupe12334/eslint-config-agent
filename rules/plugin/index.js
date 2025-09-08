import { securityRules } from "./security/index.js";
import { importRules } from "./import/index.js";

export const pluginRules = {
  ...securityRules,
  ...importRules,
};