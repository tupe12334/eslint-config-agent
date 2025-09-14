/**
 * Valid: Class property with conditional initialization in constructor
 */

export class Handler {
  callback: Function;

  constructor(callback?: Function) {
    this.callback = callback || (() => {}); // ✅ Valid: Conditional initialization in constructor
  }
}