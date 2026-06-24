/**
 * Aggregated exports for all custom ESLint rules
 *
 * This file centralizes imports from all rule modules in the rules/ directory
 * and re-exports them for easier consumption by the main configuration.
 */

// Core rule configurations
import { noTrailingSpacesConfig } from './no-trailing-spaces/index.js'
import {
  maxFunctionLinesWarning,
  maxFunctionLinesError,
} from './max-function-lines/index.js'
import {
  maxFileLinesWarning,
  maxFileLinesError,
} from './max-file-lines/index.js'

// Custom restricted syntax rules
import { noProcessEnvironmentPropertiesConfig } from './no-process-env-properties/index.js'
import { noTypeAssertionsConfig } from './no-type-assertions/index.js'
import { noExportSpecifiersConfig } from './no-empty-exports/index.js'
import { noDefaultClassExportRules } from './no-default-class-export/index.js'
import { noNullishCoalescingConfig } from './nullish-coalescing/index.js'
import { switchStatementsReturnTypeConfigs } from './switch-statements-return-type/index.js'
import { switchCaseFunctionsReturnTypeConfigs } from './switch-case-functions-return-type/index.js'
import { switchCaseExplicitReturnConfigs } from './switch-case-explicit-return/index.js'
import { noTrivialTypeAliasesConfigs } from './no-trivial-type-aliases/index.js'
import { noInlineUnionTypesConfigs } from './no-inline-union-types/index.js'

// Plugin rule configurations
import { pluginRules } from './plugin/index.js'
import { typescriptEslintRules } from './plugin/typescript-eslint/index.js'

// Consolidated exports
const allRules = {
  // Core rule configurations
  noTrailingSpacesConfig,
  maxFunctionLinesWarning,
  maxFunctionLinesError,
  maxFileLinesWarning,
  maxFileLinesError,

  // Custom restricted syntax rules
  noProcessEnvironmentPropertiesConfig,
  noTypeAssertionsConfig,
  noExportSpecifiersConfig,
  noDefaultClassExportRules,
  noNullishCoalescingConfig,
  switchStatementsReturnTypeConfigs,
  switchCaseFunctionsReturnTypeConfigs,
  switchCaseExplicitReturnConfigs,
  noTrivialTypeAliasesConfigs,
  noInlineUnionTypesConfigs,

  // Plugin rule configurations
  pluginRules,
  typescriptEslintRules,
}

export default allRules

// Named exports for backward compatibility

export { noTrailingSpacesConfig } from './no-trailing-spaces/index.js'
export {
  maxFunctionLinesWarning,
  maxFunctionLinesError,
} from './max-function-lines/index.js'
export {
  maxFileLinesWarning,
  maxFileLinesError,
} from './max-file-lines/index.js'
export { noProcessEnvironmentPropertiesConfig } from './no-process-env-properties/index.js'
export { noTypeAssertionsConfig } from './no-type-assertions/index.js'
export { noExportSpecifiersConfig } from './no-empty-exports/index.js'
export { noDefaultClassExportRules } from './no-default-class-export/index.js'
export { noNullishCoalescingConfig } from './nullish-coalescing/index.js'
export { switchStatementsReturnTypeConfigs } from './switch-statements-return-type/index.js'
export { switchCaseFunctionsReturnTypeConfigs } from './switch-case-functions-return-type/index.js'
export { switchCaseExplicitReturnConfigs } from './switch-case-explicit-return/index.js'
export { noTrivialTypeAliasesConfigs } from './no-trivial-type-aliases/index.js'
export { noInlineUnionTypesConfigs } from './no-inline-union-types/index.js'
export { pluginRules } from './plugin/index.js'
export { typescriptEslintRules } from './plugin/typescript-eslint/index.js'
