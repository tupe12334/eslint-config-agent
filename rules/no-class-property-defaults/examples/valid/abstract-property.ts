/**
 * Valid: Abstract property without default value
 */

export abstract class Base {
  abstract value: string; // ✅ Valid: Abstract property cannot have default
}