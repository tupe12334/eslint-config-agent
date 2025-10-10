// Valid: Functions using named union types

type HttpMethod = 'GET' | 'POST' | 'PUT';

// ✅ Regular function with named type
export function processRequest(method: HttpMethod) {
  return method;
}
