/**
 * Invalid: Class property with function default value
 */

export class Handler {
  callback = () => {}; // ❌ Error: Class properties cannot have default values
}