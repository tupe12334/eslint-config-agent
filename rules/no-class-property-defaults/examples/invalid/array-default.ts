/**
 * Invalid: Class property with array default value
 */

export class Collection {
  items = []; // ❌ Error: Class properties cannot have default values
}