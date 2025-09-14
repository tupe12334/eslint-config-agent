/**
 * Invalid: Class property with object default value
 */

export class Config {
  settings = {}; // ❌ Error: Class properties cannot have default values
}