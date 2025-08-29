// TypeScript-specific rule testing

interface TestInterface {
  name: string;
  age?: number;
}

// Test unused variables (should not error since no-unused-vars is off)
const unusedVar = 'test';

// Test proper typing without using 'any'
function testProperTyping<T>(param: T): T {
  return param;
}

// Test function with proper TypeScript types
function processUser(user: TestInterface): string {
  return `User: ${user.name}`;
}

// Test proper type checking instead of assertions
const someValue: unknown = 'test';
const strLength = typeof someValue === 'string' ? someValue.length : 0;

// Test arrow function with type annotation
const calculateSum = (a: number, b: number): number => a + b;

// Test generic function
function identity<T>(arg: T): T {
  return arg;
}

// Test union types
type Status = 'loading' | 'success' | 'error';
const currentStatus: Status = 'loading';

// Test optional properties access (should be explicit)
type UserAge = number | undefined;
function getUserAge(user: TestInterface): UserAge {
  // This is the preferred way instead of user.age?.toString()
  if (user.age !== undefined) {
    return user.age;
  }
  return undefined;
}

export { testProperTyping, processUser, calculateSum, identity, currentStatus, getUserAge };