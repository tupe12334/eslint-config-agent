// Valid: Multiple named exports including classes
export interface UserData {
  id: number;
  name: string;
}

export class UserRepository {
  private data: UserData[] = [];

  save(user: UserData): void {
    this.data.push(user);
  }

  findById(id: number): UserData | undefined {
    return this.data.find(user => user.id === id);
  }
}

export const DEFAULT_USER: UserData = {
  id: 0,
  name: 'Anonymous'
};