/**
 * Invalid: Private class property with default value
 */

export class Service {
  private _config = {}; // ❌ Error: Class properties cannot have default values
}