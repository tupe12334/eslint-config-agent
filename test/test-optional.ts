const obj = { a: 1 };

// This should trigger optional chaining error
const value = obj?.a;

// This should also trigger optional chaining error
const fn = obj?.toString?.();

export { value, fn };