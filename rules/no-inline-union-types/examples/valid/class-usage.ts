// Valid: Classes using named union types

type Environment = 'development' | 'staging' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';
type Layout = 'grid' | 'list';

// ✅ Class with named type properties
class ApplicationConfig {
  environment: Environment;
  logLevel: LogLevel;

  constructor() {
    this.environment = 'development';
    this.logLevel = 'info';
  }
}

// ✅ Multiple class properties with named types
class UserSettings {
  theme: Theme;
  fontSize: FontSize;
  layout: Layout;
}
