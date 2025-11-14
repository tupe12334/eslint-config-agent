/**
 * Rule configuration for no-trivial-type-aliases
 *
 * This rule disallows trivial TypeScript type aliases that don't add semantic value.
 * Trivial type aliases are direct assignments to primitive types, other types, or literals
 * without any transformation.
 *
 * ## Rationale
 *
 * Trivial type aliases can make code harder to understand and maintain because they:
 * - Add unnecessary indirection without semantic meaning
 * - Increase cognitive load when reading code
 * - Can make refactoring more difficult
 * - Don't provide any type safety benefits
 *
 * ## Rule Details
 *
 * This rule flags the following patterns:
 *
 * ### ❌ Invalid (will trigger errors):
 *
 * ```typescript
 * // Primitive type aliases
 * type MyString = string;
 * type MyNumber = number;
 * type MyBoolean = boolean;
 *
 * // Direct type reference aliases
 * type UserId = OtherId;
 * type UserData = SomeOtherType;
 *
 * // Literal type aliases
 * type Status = 'active';
 * type Count = 42;
 * ```
 *
 * ### ✅ Valid (will NOT trigger errors):
 *
 * ```typescript
 * // Union types (add semantic meaning)
 * type StringOrNumber = string | number;
 * type Status = 'active' | 'inactive' | 'pending';
 *
 * // Generic types (parameterized)
 * type Container<T> = { value: T };
 * type Result<T, E = Error> = T | E;
 *
 * // Mapped types (transformation)
 * type Partial<T> = { [P in keyof T]?: T[P] };
 *
 * // Conditional types (logic)
 * type NonNullable<T> = T extends null | undefined ? never : T;
 *
 * // Type references with generics
 * type ListOfUsers = Array<User>;
 * ```
 *
 * @see https://eslint.org/docs/latest/rules/no-restricted-syntax
 * @see ./examples/invalid.js for more invalid examples
 * @see ./examples/valid.js for more valid examples
 */

/**
 * Rule configuration for type aliases to other types without generics
 * Catches: type A = B (where B is not a generic type)
 */
const noTrivialTypeReferenceConfig = {
  selector:
    'TSTypeAliasDeclaration[typeParameters=undefined] > TSTypeReference:not([typeArguments])',
  message:
    "Trivial type aliases are not allowed. Use the original type directly instead of creating an alias that doesn't add meaning.",
}

/**
 * Rule configuration for type aliases to primitive types
 * Catches: type A = string, type B = number, etc.
 */
const noTrivialPrimitiveTypeConfig = {
  selector:
    'TSTypeAliasDeclaration > :matches(TSStringKeyword, TSNumberKeyword, TSBooleanKeyword, TSAnyKeyword, TSUnknownKeyword)',
  message:
    'Trivial type aliases to primitive types are not allowed. Use the primitive type directly instead.',
}

/**
 * Rule configuration for type aliases to literal types
 * Catches: type A = 'literal', type B = 42, etc.
 */
const noTrivialLiteralTypeConfig = {
  selector: 'TSTypeAliasDeclaration > TSLiteralType',
  message:
    'Trivial type aliases to literal types are not allowed. Use the literal type directly instead.',
}

/**
 * Combined configuration array for all trivial type alias rules
 */
const noTrivialTypeAliasesConfigs = [
  noTrivialTypeReferenceConfig,
  noTrivialPrimitiveTypeConfig,
  noTrivialLiteralTypeConfig,
]

// Consolidated exports
export {
  noTrivialTypeReferenceConfig,
  noTrivialPrimitiveTypeConfig,
  noTrivialLiteralTypeConfig,
  noTrivialTypeAliasesConfigs,
}

export default noTrivialTypeAliasesConfigs
