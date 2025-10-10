// Valid: Nested interface using named union types

type DatabaseType = 'postgres' | 'mysql' | 'sqlite';
type DatabaseMode = 'read' | 'write';

// ✅ Nested interface with named types
export interface NestedConfig {
  database: {
    type: DatabaseType;
    mode: DatabaseMode;
  };
}
