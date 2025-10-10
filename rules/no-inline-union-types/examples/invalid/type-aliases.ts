// Invalid: Type alias object properties with inline unions

// ❌ Type alias with inline unions
export interface ApiConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  format: 'json' | 'xml';
}
