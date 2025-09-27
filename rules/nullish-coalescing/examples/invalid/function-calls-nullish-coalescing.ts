// Invalid: Nullish coalescing with function calls
export class DataService {
  // Should trigger rule: ?? with method calls
  getData(): string {
    return this.fetchFromCache() ?? this.fetchFromAPI() ?? 'no-data';
  }

  // Should trigger rule: ?? in return statements
  getUser(id: string): User | null {
    const user = this.findUser(id);
    return user ?? this.createDefaultUser();
  }

  // Should trigger rule: ?? with async function calls
  async processAsync(): Promise<string> {
    const result = await this.fetchData();
    return result ?? await this.fetchFallbackData() ?? 'error';
  }

  private fetchFromCache(): string | null { return null; }
  private fetchFromAPI(): string | null { return null; }
  private findUser(id: string): User | null { return null; }
  private createDefaultUser(): User { return { id: '1', name: 'Default' }; }
  private async fetchData(): Promise<string | null> { return null; }
  private async fetchFallbackData(): Promise<string | null> { return null; }
}

interface User {
  id: string;
  name: string;
}