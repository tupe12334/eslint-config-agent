// Test file for type assertion rules
// This file tests the @typescript-eslint/consistent-type-assertions rule
// which should prevent 'as' keyword usage except for 'as const'

interface User {
  name: string;
  age: number;
}

// ✅ VALID: 'as const' should be allowed
const validConstAssertion = {
  status: 'success',
  count: 42,
} as const;

const colors = ['red', 'green', 'blue'] as const;

const statusValues = ['loading', 'success', 'error'] as const;
type Status = typeof statusValues[number];

// ✅ VALID: Proper typing without assertions
type UserOrNull = User | null;
function processUser(input: unknown): UserOrNull {
  if (isUser(input)) {
    return input;
  }
  return null;
}

// ✅ VALID: Type guards instead of assertions
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const hasName = 'name' in value && typeof value.name === 'string';
  const hasAge = 'age' in value && typeof value.age === 'number';

  return hasName && hasAge;
}

// ✅ VALID: Explicit type annotations
const userFromApi: User = {
  name: 'John',
  age: 30,
};

// ✅ VALID: Generic functions with proper constraints
function identity<T>(value: T): T {
  return value;
}

// ✅ VALID: Union type handling with type guards
function handleApiResponse(response: unknown): string {
  if (typeof response === 'object' && response !== null) {
    if ('success' in response && response.success === true && 'data' in response) {
      const data = response.data;
      if (isUser(data)) {
        return `Welcome, ${data.name}!`;
      }
    } else if ('success' in response && response.success === false && 'error' in response) {
      const error = response.error;
      if (typeof error === 'string') {
        return `Error: ${error}`;
      }
    }
  }
  return 'Unknown response format';
}

// Export for testing
export {
  validConstAssertion,
  colors,
  statusValues,
  processUser,
  isString,
  isUser,
  userFromApi,
  identity,
  handleApiResponse,
};