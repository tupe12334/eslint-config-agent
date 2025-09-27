// Valid: Specific interface and type definitions (preferred)

// Explicit interface definitions provide better type safety
interface UserProfile {
  name: string;
  email: string;
  age: number;
}

// Type aliases for object shapes
type ApiConfig = {
  host: string;
  port: number;
  ssl: boolean;
};

// Union types
type ThemeMode = "light" | "dark" | "auto";

// Computed property names
type DynamicObject = {
  [K in `theme-${string}`]: boolean;
};

// Index signatures with constraints
type StringMap = {
  [key: string]: string;
};