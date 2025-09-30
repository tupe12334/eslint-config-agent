/**
 * Valid examples for no-trivial-type-aliases rule
 * These patterns should NOT trigger ESLint errors
 */

// Define some base types for examples
interface User {
  name: string;
  id: string;
}

// ✅ Union types (add semantic meaning)
type StringOrNumber = string | number;
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// ✅ Intersection types (combine types)
type UserWithTimestamps = User & {
  createdAt: Date;
  updatedAt: Date;
};

// ✅ Generic types (parameterized)
type Result<T, E = Error> = T | E;

// ✅ Mapped types (transformation)
type Partial<T> = {
  [P in keyof T]?: T[P];
};
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// ✅ Conditional types (logic)
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : unknown;

// ✅ Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;

// ✅ Index access types
type ValueOf<T> = T[keyof T];

// ✅ Type references with generics
type ListOfUsers = Array<User>;
type UserMap = Map<string, User>;
type Promise<T> = Promise<T>;

// ✅ Function types
type EventHandler<T> = (event: T) => void;
type Validator<T> = (value: T) => boolean;