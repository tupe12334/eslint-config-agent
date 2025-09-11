// Valid: Using generics instead of any
export function identity<T>(value: T): T {
  return value;
}

export class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}