// Invalid: Class properties with inline union types

// ❌ Class with literal union properties
export class ApplicationConfig {
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';

  constructor() {
    this.environment = 'development';
    this.logLevel = 'info';
  }
}
