// Invalid: Multiple class properties with inline union types

// ❌ Multiple class properties with unions
export class UserSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  layout: 'grid' | 'list';
}
