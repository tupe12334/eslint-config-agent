/**
 * Invalid: Readonly class property with default value
 */

export class Config {
  readonly version = '1.0.0'; // ❌ Error: Class properties cannot have default values
}