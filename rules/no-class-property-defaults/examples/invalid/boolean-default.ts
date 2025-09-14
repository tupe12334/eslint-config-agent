/**
 * Invalid: Class property with boolean default value
 */

export class Feature {
  enabled = false; // ❌ Error: Class properties cannot have default values
}