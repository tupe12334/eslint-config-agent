// Valid: Generic Record types with non-literal keys

// Generic string keys (allowed)
type UserData = Record<string, unknown>;
const config: Record<string, any> = {};
type ApiResponse = Record<PropertyKey, string>;

// Template literal types with dynamic parts
type PrefixedKeys = Record<`prefix-${string}`, boolean>;
type SuffixedKeys = Record<`${string}-suffix`, number>;

// Specific interfaces (preferred alternative)
interface UserInfo {
  name: string;
  age: string;
}

type Status = {
  active: boolean;
  lastSeen: Date;
};

// Generic type parameters
type GenericRecord<T> = Record<string, T>;
const data: GenericRecord<number> = { count: 42 };