/**
 * Invalid: Class property with number default value
 */

export class Counter {
  count = 0; // ❌ Error: Class properties cannot have default values
}