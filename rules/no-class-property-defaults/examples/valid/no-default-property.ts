/**
 * Valid: Class property without default value
 */

export class Service {
  config: Record<string, unknown>; // ✅ Valid: No default value assigned

  setup(config: Record<string, unknown>): void {
    this.config = config;
  }
}