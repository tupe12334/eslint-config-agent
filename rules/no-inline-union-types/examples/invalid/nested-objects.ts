// Invalid: Nested interface with inline union types

// ❌ Nested interface
export interface NestedConfig {
  database: {
    type: 'postgres' | 'mysql' | 'sqlite';
    mode: 'read' | 'write';
  };
}
