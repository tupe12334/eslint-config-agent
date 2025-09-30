/**
 * Invalid examples for no-trivial-type-aliases rule
 * These patterns should trigger ESLint errors
 */

// ❌ Trivial primitive type aliases
type MyString = string;
type MyNumber = number;
type MyBoolean = boolean;
type MyNull = null;
type MyUndefined = undefined;
type MyVoid = void;
type MyUnknown = unknown;
type MyNever = never;
type MyBigInt = bigint;
type MySymbol = symbol;
type MyObject = object;

// Define some types first
interface OtherId { id: string; }
interface SomeOtherType { data: unknown; }

// ❌ Trivial type reference aliases (without generics)
type UserId = OtherId;
type UserData = SomeOtherType;

// ❌ Trivial literal type aliases
type Status = 'active';
type Count = 42;
type IsReady = true;