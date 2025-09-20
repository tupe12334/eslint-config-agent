// Invalid: Default abstract class export
export default abstract class BaseHandler {
  protected active = false;

  abstract handle(): void;

  isActive(): boolean {
    return this.active;
  }
}