// Invalid: Function parameters with inline union types

// ❌ Regular function with inline union
export function processRequest(method: 'GET' | 'POST' | 'PUT') {
  return method;
}
