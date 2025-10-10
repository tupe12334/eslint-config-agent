/**
 * Rule configuration for no-inline-union-types
 *
 * This rule disallows inline union types in type annotations, requiring
 * named type declarations instead for better type reusability and maintainability.
 *
 * Examples:
 * - ❌ function foo(status: 'active' | 'inactive') {}
 * - ❌ interface User { role: 'admin' | 'user'; }
 * - ❌ class Config { mode: 'dev' | 'prod'; }
 * - ✅ type Status = 'active' | 'inactive'; function foo(status: Status) {}
 * - ✅ type Role = 'admin' | 'user'; interface User { role: Role; }
 * - ✅ type Mode = 'dev' | 'prod'; class Config { mode: Mode; }
 *
 * @see https://eslint.org/docs/latest/rules/no-restricted-syntax
 */

const rule = "error";

// General inline union types (excludes property-specific cases to avoid duplication)
const selectorGeneral =
  "TSTypeAnnotation > TSUnionType:not(PropertyDefinition > .typeAnnotation > .typeAnnotation):not(TSPropertySignature > .typeAnnotation > .typeAnnotation)";

// Interface properties with literal unions
const selectorInterfaceProperty =
  "TSPropertySignature > TSTypeAnnotation > TSUnionType:has(TSLiteralType)";

// Class properties with literal unions
const selectorClassProperty =
  "PropertyDefinition > TSTypeAnnotation > TSUnionType:has(TSLiteralType)";

const messageGeneral = "Use a named type declaration instead of inline union types.";
const messageProperty =
  "Interface properties with literal unions should use a named type declaration.";
const messageClassProperty =
  "Class properties with literal unions should use a named type declaration.";

/**
 * Export the complete rule configurations for no-restricted-syntax
 * Can be used in ESLint config as part of no-restricted-syntax rules
 */
const noInlineUnionTypesGeneralConfig = {
  selector: selectorGeneral,
  message: messageGeneral,
};

const noInlineUnionTypesInterfacePropertyConfig = {
  selector: selectorInterfaceProperty,
  message: messageProperty,
};

const noInlineUnionTypesClassPropertyConfig = {
  selector: selectorClassProperty,
  message: messageClassProperty,
};

/**
 * Combined rule configurations for comprehensive inline union type prevention
 */
const noInlineUnionTypesConfigs = [
  noInlineUnionTypesGeneralConfig,
  noInlineUnionTypesInterfacePropertyConfig,
  noInlineUnionTypesClassPropertyConfig,
];

// Consolidated exports
export {
  rule,
  selectorGeneral,
  selectorInterfaceProperty,
  selectorClassProperty,
  messageGeneral,
  messageProperty,
  messageClassProperty,
  noInlineUnionTypesGeneralConfig,
  noInlineUnionTypesInterfacePropertyConfig,
  noInlineUnionTypesClassPropertyConfig,
  noInlineUnionTypesConfigs,
};

export default noInlineUnionTypesConfigs;
