/**
 * Invalid: Class property with string default value
 */

export class User {
  name = 'default'; // ❌ Error: Class properties cannot have default values
}