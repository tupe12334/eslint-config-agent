// Invalid: Interface properties with inline union types

// ❌ Interface with literal union properties
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'es' | 'fr';
  notifications: 'all' | 'important' | 'none';
}
