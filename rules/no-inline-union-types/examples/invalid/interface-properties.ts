// Invalid: Interface properties with inline union types

// ❌ Interface with literal union properties
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'es' | 'fr';
  notifications: 'all' | 'important' | 'none';
}

// ❌ Type alias with inline unions
type ApiConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  format: 'json' | 'xml';
};

// ❌ Nested interface
interface NestedConfig {
  database: {
    type: 'postgres' | 'mysql' | 'sqlite';
    mode: 'read' | 'write';
  };
}
