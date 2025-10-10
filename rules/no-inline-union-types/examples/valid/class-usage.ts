// Valid: Classes using named union types

type Environment = 'development' | 'staging' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ✅ Class with named type properties
export class ApplicationConfig {
  environment: Environment;
  logLevel: LogLevel;

  constructor() {
    this.environment = 'development';
    this.logLevel = 'info';
  }
}
