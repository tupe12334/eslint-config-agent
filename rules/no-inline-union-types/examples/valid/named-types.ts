// Valid: Named type declarations for union types

// ✅ Named types for literals
type Theme = 'light' | 'dark' | 'auto';
type Language = 'en' | 'es' | 'fr';
type NotificationLevel = 'all' | 'important' | 'none';

// ✅ Using named types in interfaces
interface UserPreferences {
  theme: Theme;
  language: Language;
  notifications: NotificationLevel;
}

// ✅ Named types for HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type DataFormat = 'json' | 'xml';

type ApiConfig = {
  method: HttpMethod;
  format: DataFormat;
};
