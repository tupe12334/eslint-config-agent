// Valid: Type alias object properties using named union types

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type DataFormat = 'json' | 'xml';

// ✅ Type alias with named types
export interface ApiConfig {
  method: HttpMethod;
  format: DataFormat;
}
