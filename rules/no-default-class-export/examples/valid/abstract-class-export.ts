// Valid: Named abstract class export
export abstract class BaseService {
  protected initialized = false;

  abstract initialize(): Promise<void>;

  isInitialized(): boolean {
    return this.initialized;
  }
}

export class ConcreteService extends BaseService {
  async initialize(): Promise<void> {
    // Implementation
    this.initialized = true;
  }
}