// Valid: Class methods using named union types

type HttpMethod = 'GET' | 'POST';

// ✅ Method with named type parameter
export class ApiClient {
  request(method: HttpMethod, endpoint: string) {
    return `${method} ${endpoint}`;
  }
}
