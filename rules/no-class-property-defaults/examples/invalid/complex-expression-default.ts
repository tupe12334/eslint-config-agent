/**
 * Invalid: Class property with complex expression default value
 */

export class Calculator {
  result = Math.random() * 100; // ❌ Error: Class properties cannot have default values
}