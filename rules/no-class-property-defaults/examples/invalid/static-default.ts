/**
 * Invalid: Static class property with default value
 */

export class Config {
  static defaultSettings = { debug: false }; // ❌ Error: Class properties cannot have default values
}