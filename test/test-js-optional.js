const obj = { a: 1 };

// This should trigger optional chaining error
const value = obj?.a;

// This should also trigger optional chaining error
const fn = obj?.toString?.();

// This should trigger nullish coalescing error
const result = value ?? 'default';

export { value, fn, result };