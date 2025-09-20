// Invalid: Default generic class export
export default class Repository<T> {
  private items: T[] = [];

  save(item: T): void {
    this.items.push(item);
  }

  findAll(): T[] {
    return [...this.items];
  }
}