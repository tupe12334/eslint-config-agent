// Invalid: Class method parameters with inline union types

// ❌ Method with inline union parameter
export class ApiClient {
  request(method: 'GET' | 'POST', endpoint: string) {
    return `${method} ${endpoint}`;
  }
}
