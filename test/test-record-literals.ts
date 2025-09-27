// Test file for Record with string literal keys rule

// SHOULD TRIGGER ERROR: Record with string literal keys
type BadType1 = Record<"name" | "age", string>;
type BadType2 = Record<"key1", unknown>;
type BadType3 = Record<"prop", any>;
type BadType4 = Record<"a" | "b" | "c", number>;

// SHOULD BE ALLOWED: Record with non-literal types
type GoodType1 = Record<string, unknown>;
type GoodType2 = Record<number, string>;
type GoodType3 = Record<keyof SomeInterface, boolean>;

interface SomeInterface {
  prop1: string;
  prop2: number;
}

// SHOULD BE ALLOWED: Proper interfaces and type aliases
interface ProperInterface {
  name: string;
  age: number;
}

interface ProperType {
  key1: unknown;
  prop: any;
}

// Test with nested types
interface NestedBad {
  data: Record<"id" | "value", string>; // Should trigger error
}

interface NestedGood {
  data: Record<string, string>; // Should be allowed
}

// Test with union types containing Record
type UnionBad = string | Record<"test", boolean>; // Should trigger error
type UnionGood = string | Record<string, boolean>; // Should be allowed

export { BadType1, BadType2, GoodType1, ProperInterface };