// Valid: Using conditional statements for complex null/undefined handling
export class DataService {
  // Valid: explicit conditional logic
  getData(): string {
    const cacheResult = this.fetchFromCache();
    if (cacheResult !== null && cacheResult !== undefined) {
      return cacheResult;
    }

    const apiResult = this.fetchFromAPI();
    if (apiResult !== null && apiResult !== undefined) {
      return apiResult;
    }

    return 'no-data';
  }

  // Valid: early returns with explicit checks
  getUser(id: string): User | null {
    const user = this.findUser(id);

    if (user !== null && user !== undefined) {
      return user;
    }

    return this.createDefaultUser();
  }

  private fetchFromCache(): string | null { return null; }
  private fetchFromAPI(): string | null { return null; }
  private findUser(id: string): User | null { return null; }
  private createDefaultUser(): User { return {} as User; }
}

// Valid: guard clauses with explicit checks
export function processData(input: string | null | undefined): string {
  if (input === null) {
    return 'input was null';
  }

  if (input === undefined) {
    return 'input was undefined';
  }

  return input;
}

interface User {
  id: string;
  name: string;
}