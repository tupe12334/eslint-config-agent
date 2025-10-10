// Valid: Named type declarations for union types

// ✅ Named types for literals
type Theme = 'light' | 'dark' | 'auto';
type Language = 'en' | 'es' | 'fr';
type NotificationLevel = 'all' | 'important' | 'none';

// ✅ Using named types in interfaces
export interface UserPreferences {
  theme: Theme;
  language: Language;
  notifications: NotificationLevel;
}
