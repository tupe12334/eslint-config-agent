// Invalid: Class properties with inline union types

// ❌ Class with literal union properties
class ApplicationConfig {
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';

  constructor() {
    this.environment = 'development';
    this.logLevel = 'info';
  }
}

// ❌ Multiple class properties with unions
class UserSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  layout: 'grid' | 'list';
}
